#!/usr/bin/env node
/**
 * One-off import of the legacy WordPress blog into content/blog.
 *
 * The old WordPress site is gone; only its MySQL database survives (on the
 * easypanel host, container merakiweddingplanner-com_wordpress-db). Export the
 * published posts to JSON first, then run this script against that file:
 *
 *   mysql --default-character-set=utf8mb4 -N --raw -D 'merakiweddingplanner-com' -e "
 *     select json_arrayagg(json_object(
 *       'slug', post_name, 'title', post_title, 'date', post_date,
 *       'cat', cat, 'thumb', thumb, 'content', post_content)) from ( ... )" > wp_posts.json
 *
 *   node scripts/wp-import/index.mjs --input wp_posts.json [--dry-run]
 *
 * Requires S3_REGION / S3_BUCKET / S3_ACCESS_KEY / S3_SECRET_KEY (see .env.local).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import yaml from 'js-yaml';

import { buildContentBlocks, firstParagraph, parseRuns } from './blocks.mjs';
import { rehostImage } from './images.mjs';
import { PAIRS, SKIPPED } from './pairs.mjs';
import { normaliseTitle } from './titles.mjs';

const OUTPUT_DIR = path.join(process.cwd(), 'content', 'blog');

// WordPress only categorised posts by language ("English"/"Vietnamese"), which
// is not a topic taxonomy. Imported posts get the collection's existing default
// so they are easy to re-file in TinaCMS later.
const DEFAULT_CATEGORIES = ['Wedding Planning'];
const DEFAULT_TAGS = ['planning', 'wedding'];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const inputIndex = args.indexOf('--input');
const inputPath = inputIndex === -1 ? null : args[inputIndex + 1];

if (!inputPath) {
  console.error('error: --input <wp_posts.json> is required');
  process.exit(1);
}

dotenv.config({ path: '.env.local' });
dotenv.config();

const { S3_REGION, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY } = process.env;
if (!dryRun && !(S3_REGION && S3_BUCKET && S3_ACCESS_KEY && S3_SECRET_KEY)) {
  console.error('error: S3_REGION, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY required');
  process.exit(1);
}

const s3 = new S3Client({
  region: S3_REGION,
  credentials: { accessKeyId: S3_ACCESS_KEY, secretAccessKey: S3_SECRET_KEY },
});

const posts = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const bySlug = new Map(posts.map((post) => [post.slug, post]));

const missing = PAIRS.flatMap(([en, vi]) =>
  [en, vi].filter((slug) => !bySlug.has(slug)),
);
if (missing.length > 0) {
  console.error(`error: slugs absent from the export: ${missing.join(', ')}`);
  process.exit(1);
}

/** Collect every image URL referenced by the topics being imported. */
const collectImageUrls = () => {
  const urls = new Set();
  for (const [enSlug, viSlug] of PAIRS) {
    for (const slug of [enSlug, viSlug]) {
      const post = bySlug.get(slug);
      if (post.thumb) {
        urls.add(post.thumb);
      }
      for (const run of parseRuns(post.content)) {
        if (run.type === 'image') {
          urls.add(run.src);
        }
      }
    }
  }
  return [...urls];
};

const imageUrls = collectImageUrls();
console.log(
  `${PAIRS.length} topics to import, ${SKIPPED.length} skipped, ${imageUrls.length} unique images referenced`,
);

/** original url -> { url, width, height } for what could be recovered. */
const images = new Map();
const deadImages = [];
let fallbackCount = 0;
let uploadedBytes = 0;

const CONCURRENCY = 8;
for (let index = 0; index < imageUrls.length; index += CONCURRENCY) {
  const batch = imageUrls.slice(index, index + CONCURRENCY);
  const results = await Promise.all(
    batch.map(async (sourceUrl) => {
      try {
        const result = await rehostImage({
          client: s3,
          bucket: S3_BUCKET,
          region: S3_REGION,
          sourceUrl,
          dryRun,
        });
        return { sourceUrl, result };
      } catch (error) {
        return { sourceUrl, result: null, error };
      }
    }),
  );

  for (const { sourceUrl, result, error } of results) {
    if (error) {
      console.error(`  ! ${sourceUrl}: ${error.message}`);
    }
    if (result) {
      images.set(sourceUrl, result);
      uploadedBytes += result.bytes;
      if (result.usedFallback) {
        fallbackCount += 1;
      }
    } else {
      deadImages.push(sourceUrl);
    }
  }
  process.stdout.write(
    `\r  images: ${images.size} recovered, ${deadImages.length} unavailable (${Math.min(index + CONCURRENCY, imageUrls.length)}/${imageUrls.length})`,
  );
}
process.stdout.write('\n');
console.log(
  `  ${fallbackCount} recovered via full-size fallback, ${(uploadedBytes / 1e6).toFixed(1)} MB total`,
);

const toIsoDate = (wpDate) =>
  new Date(`${wpDate.replace(' ', 'T').slice(0, 19)}Z`).toISOString();

const allWarnings = [];

for (const [enSlug, viSlug, newSlug] of PAIRS) {
  const en = bySlug.get(enSlug);
  const vi = bySlug.get(viSlug);

  const enRuns = parseRuns(en.content);
  const viRuns = parseRuns(vi.content);
  const { blocks, warnings } = buildContentBlocks({ enRuns, viRuns, images });

  const featured = en.thumb ? images.get(en.thumb) : null;
  if (en.thumb && !featured) {
    warnings.push('featured image unavailable; field omitted');
  }

  const titleEn = normaliseTitle(en.title, 'en');
  const titleVi = normaliseTitle(vi.title, 'vi');

  const document = {
    title_en: titleEn,
    title_vi: titleVi,
    ...(featured ? { featured_image: featured.url } : {}),
    excerpt_en: firstParagraph(enRuns, { title: titleEn }),
    excerpt_vi: firstParagraph(viRuns, { title: titleVi }),
    content_blocks: blocks,
    categories: DEFAULT_CATEGORIES,
    tags: DEFAULT_TAGS,
    slug: newSlug,
    published_date: toIsoDate(en.date),
    published: true,
  };

  const frontmatter = yaml.dump(document, {
    lineWidth: -1,
    noRefs: true,
    quotingType: "'",
  });
  const target = path.join(OUTPUT_DIR, `${newSlug}.mdx`);

  if (!dryRun) {
    fs.writeFileSync(target, `---\n${frontmatter}---\n`);
  }

  const galleries = blocks.filter((b) => b._template === 'imageGallery');
  const imageCount = galleries.reduce((sum, b) => sum + b.images.length, 0);
  console.log(
    `  ${newSlug}.mdx  blocks=${blocks.length} images=${imageCount}${warnings.length ? `  (${warnings.length} warning(s))` : ''}`,
  );
  warnings.forEach((warning) => allWarnings.push(`${newSlug}: ${warning}`));
}

console.log(`\nskipped (already written by hand in content/blog):`);
SKIPPED.forEach(([wpSlug, existing]) =>
  console.log(`  ${wpSlug}  ->  ${existing}`),
);

if (allWarnings.length > 0) {
  console.log(`\nwarnings (${allWarnings.length}):`);
  allWarnings.forEach((warning) => console.log(`  ${warning}`));
}

if (deadImages.length > 0) {
  console.log(`\nunrecoverable images (${deadImages.length}):`);
  deadImages.forEach((url) => console.log(`  ${url}`));
}

if (dryRun) {
  console.log('\ndry run: no files written, nothing uploaded');
}
