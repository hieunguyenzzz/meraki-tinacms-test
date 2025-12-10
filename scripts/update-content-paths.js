import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BUCKET = process.env.S3_BUCKET;
const REGION = process.env.S3_REGION;
const CDN_URL = process.env.S3_CDN_URL || `https://${BUCKET}.s3.${REGION}.amazonaws.com`;

const CONTENT_DIR = join(__dirname, '../content');

function updateFilePaths(content) {
  // Replace local paths with S3 URLs
  // Pattern: /images/... -> https://bucket.s3.region.amazonaws.com/images/...

  // Handle quoted paths (single or double quotes)
  let result = content.replace(
    /(['"])(\/images\/[^'"]+)(['"])/g,
    `$1${CDN_URL}$2$3`
  );

  // Handle unquoted paths in YAML (after colon and space)
  result = result.replace(
    /^(\s*\w+:\s*)(\/images\/[^\s\n]+)/gm,
    `$1${CDN_URL}$2`
  );

  return result;
}

async function main() {
  console.log('Updating content paths...');
  console.log(`S3 CDN URL: ${CDN_URL}`);
  console.log(`Content directory: ${CONTENT_DIR}`);

  if (!existsSync(CONTENT_DIR)) {
    console.error('Content directory does not exist!');
    process.exit(1);
  }

  const mdxFiles = await glob(`${CONTENT_DIR}/**/*.mdx`);
  console.log(`Found ${mdxFiles.length} MDX files`);

  let updatedCount = 0;
  let skippedCount = 0;

  for (const file of mdxFiles) {
    const content = readFileSync(file, 'utf-8');
    const updated = updateFilePaths(content);

    if (content !== updated) {
      writeFileSync(file, updated);
      console.log(`Updated: ${file}`);
      updatedCount++;
    } else {
      skippedCount++;
    }
  }

  console.log('\nContent path update complete!');
  console.log(`Updated: ${updatedCount} files`);
  console.log(`Skipped (no changes): ${skippedCount} files`);
}

main().catch(console.error);
