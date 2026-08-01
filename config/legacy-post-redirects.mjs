import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Permanent redirects from the retired WordPress post URLs to their v2 equivalents.
 *
 * The old site ran Next.js with built-in i18n and `defaultLocale: 'en'`, so English
 * posts were served from /posts/<slug> and Vietnamese ones from /vi/posts/<slug>,
 * the Vietnamese slugs ending in "-vi". Both shapes are indexed and both are mapped
 * here.
 *
 * The table below records only which *post* an old slug belongs to. Destinations are
 * derived at build time from that post's `slug` / `slug_vi` frontmatter, because that
 * is what src/app/[lang]/posts/[slug] resolves against. An earlier version hardcoded
 * the destination as the filename instead, which silently drifted out of sync with
 * the frontmatter and left all 47 redirects pointing at 404s.
 *
 * 301 rather than 308: this is a content migration, and 301 is what crawlers and
 * SEO tooling expect for a permanently moved page.
 */

const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../content/blog');

/** @type {{ from: string, lang: 'en' | 'vi', file: string }[]} */
const LEGACY_POSTS = [
  // An Expert Guide to Get the Perfect Wedding Suit
  { from: 'an-expert-guide-to-get-the-perfect-wedding-suit', lang: 'en', file: 'wedding-suit-guide' },
  { from: 'nhung-dieu-chu-re-can-biet-de-chon-duoc-bo-suit-hoan-hao-vi', lang: 'vi', file: 'wedding-suit-guide' },
  // 10 Common Wedding Makeup Mistakes You Should Avoid
  { from: '10-common-wedding-makeup-mistakes-you-should-avoid', lang: 'en', file: 'wedding-makeup-mistakes' },
  { from: '10-loi-trang-diem-pho-bien-cac-co-dau-nen-tranh-vi', lang: 'vi', file: 'wedding-makeup-mistakes' },
  // Do & Don’t – for a Meaningful Getting-Ready
  { from: 'do-dont-for-a-meaningful-getting-ready', lang: 'en', file: 'getting-ready-dos-and-donts' },
  { from: 'nhung-dieu-nen-va-khong-nen-cho-buoi-getting-ready-tron-ven-vi', lang: 'vi', file: 'getting-ready-dos-and-donts' },
  // A Meraki’s Checklist for Vietnamese Ceremonies and Weddings
  { from: 'checklist-chi-tiet-nhung-viec-can-lam-cho-dam-hoi-va-dam-cuoi', lang: 'en', file: 'vietnamese-ceremony-checklist' },
  { from: 'checklist-chi-tiet-nhung-viec-can-lam-cho-dam-hoi-va-dam-cuoi-vi', lang: 'vi', file: 'vietnamese-ceremony-checklist' },
  // The Ins and Outs of Intimate Weddings
  { from: 'the-ins-and-outs-of-intimate-weddings', lang: 'en', file: 'intimate-weddings' },
  { from: 'intimate-wedding-mot-tiec-cuoi-than-mat-dien-ra-nhu-the-nao-vi', lang: 'vi', file: 'intimate-weddings' },
  // Wedding Day Ultimate Packing Checklist for Brides and Grooms
  { from: 'wedding-day-ultimate-packing-checklist-for-brides-and-grooms', lang: 'en', file: 'wedding-day-packing-checklist' },
  { from: 'co-dau-chu-re-can-mang-theo-vat-dung-nao-trong-ngay-cuoi-vi', lang: 'vi', file: 'wedding-day-packing-checklist' },
  // Color Coordination for Your Wedding Party
  { from: 'color-coordination-for-your-wedding-party', lang: 'en', file: 'wedding-party-colour-coordination' },
  { from: 'gam-mau-trong-trang-phuc-phu-dau-phu-re-vi', lang: 'vi', file: 'wedding-party-colour-coordination' },
  // How to Entertain & Manage Kids in Wedding?
  { from: 'how-to-entertain-manage-kids-in-wedding', lang: 'en', file: 'entertaining-kids-at-weddings' },
  { from: 'nhung-hoat-dong-danh-cho-vi-khach-nhi-trong-dam-cuoi-vi', lang: 'vi', file: 'entertaining-kids-at-weddings' },
  // Beach Wedding and Mountain Wedding. Which Is Most Suitable for You?
  { from: 'beach-wedding-and-mountain-wedding', lang: 'en', file: 'beach-vs-mountain-wedding' },
  { from: 'dia-diem-destinations-wedding-nao-se-phu-hop-voi-ban-vi', lang: 'vi', file: 'beach-vs-mountain-wedding' },
  // Wedding Cocktail Hour
  { from: 'wedding-cocktail-hour', lang: 'en', file: 'wedding-cocktail-hour' },
  { from: 'cung-meraki-tim-hieu-ve-tiec-cocktail-vi', lang: 'vi', file: 'wedding-cocktail-hour' },
  // Wedding Bathroom Basket Checklist
  { from: 'bathroom-basket', lang: 'en', file: 'wedding-bathroom-basket' },
  { from: 'checklist-vat-dung-can-thiet-cho-khach-moi-vi', lang: 'vi', file: 'wedding-bathroom-basket' },
  // Wedding Round Table vs Long (Banquet) Table — the only old post that was never
  // migrated. Pointed at the other table-layout post so the indexed URL keeps landing
  // on something relevant; retarget it if the post is ever imported.
  { from: 'roundtable-vs-longtable', lang: 'en', file: 'head-vs-sweetheart-table' },
  { from: 'ban-tron-vs-ban-dai-vi', lang: 'vi', file: 'head-vs-sweetheart-table' },
  // Head Table or Sweetheart Table
  { from: 'headtable-vs-sweetheart-table-en', lang: 'en', file: 'head-vs-sweetheart-table' },
  { from: 'head-vs-sweetheart-vi', lang: 'vi', file: 'head-vs-sweetheart-table' },
  // Tips for a Glowing Skin and Healthy Hair
  { from: 'tips-for-a-glowing-skin-and-healthy-hair', lang: 'en', file: 'glowing-skin-and-healthy-hair' },
  { from: 'cham-soc-da-vi', lang: 'vi', file: 'glowing-skin-and-healthy-hair' },
  // How to Throw the Perfect Bachelorette Party
  { from: 'how-to-throw-the-perfect-bachelorette-party', lang: 'en', file: 'bachelorette-party' },
  { from: 'tiec-doc-than-vi', lang: 'vi', file: 'bachelorette-party' },
  // Planning for a Perfect Wedding in the Rainy Season
  { from: 'wedding-in-the-rainy-season', lang: 'en', file: 'rainy-season-wedding' },
  { from: 'wedding-in-rainy-season-vi', lang: 'vi', file: 'rainy-season-wedding' },
  // What Does a Wedding Planner Really Do?
  { from: 'wedding-planner-job', lang: 'en', file: 'what-a-wedding-planner-does' },
  { from: 'wedding-planner-job-2-vi', lang: 'vi', file: 'what-a-wedding-planner-does' },
  // Wedding Vows: How to Write Yours
  { from: 'writing-vows-how-to-put-your-heart-into-words', lang: 'en', file: 'wedding-vows' },
  { from: 'lam-sao-de-wedding-vows-duoc-chin-chu-va-cam-xuc-vi', lang: 'vi', file: 'wedding-vows' },
  // 12 Fun Wedding Games to Break the Ice
  { from: 'wedding-games-en', lang: 'en', file: 'wedding-games-ideas' },
  { from: 'wedding-games-vi', lang: 'vi', file: 'wedding-games-ideas' },
  // ​​​​​​​​Western Wedding Ceremony: Full Guide to Traditions
  { from: 'western-wedding-traditions', lang: 'en', file: 'western-wedding-ceremony-guide' },
  { from: 'cac-nghi-thuc-truyen-thong-cua-dam-cuoi-tai-phuong-tay-vi', lang: 'vi', file: 'western-wedding-ceremony-guide' },
  // Destination Wedding in Phu Quoc: Complete Guide From Planner
  { from: 'the-planners-guide-to-getting-married-in-phu-quoc-island', lang: 'en', file: 'phu-quoc-destination-wedding-guide' },
  { from: 'kinh-nghiem-to-chuc-tiec-cuoi-tai-dao-ngoc-phu-quoc-vi', lang: 'vi', file: 'phu-quoc-destination-wedding-guide' },
  // 5 Wedding After Party Ideas That Guests Will Never Forget
  { from: 'how-to-plan-a-wedding-after-party', lang: 'en', file: 'wedding-after-party-ideas' },
  { from: 'after-party-vi', lang: 'vi', file: 'wedding-after-party-ideas' },
  // Unique Wedding Venues in Ho Chi Minh City
  { from: 'unique-wedding-venues-in-hcmc', lang: 'en', file: 'wedding-venues-ho-chi-minh-city' },
  { from: 'unique-locations-vi', lang: 'vi', file: 'wedding-venues-ho-chi-minh-city' },
  // Traditional Vietnamese Wedding: A-Z Guide to Customs, Timeline & Rituals
  { from: 'traditional-wedding-playbook', lang: 'en', file: 'traditional-wedding' },
];

const unquote = (value) => value.trim().replace(/^['"]|['"]$/g, '');

/** Reads one scalar out of an MDX frontmatter block. */
function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:[ \\t]*(.+)$`, 'm'));
  const value = match ? unquote(match[1]) : '';
  return value || null;
}

/**
 * `slug` / `slug_vi` for every post, keyed by filename. Mirrors `toBlogSlugEntry`
 * in the detail route: the filename is the fallback slug, and `slug_vi` falls back
 * to the English slug.
 */
function readPostSlugs() {
  const slugs = new Map();

  for (const filename of readdirSync(CONTENT_DIR)) {
    if (!filename.endsWith('.mdx')) continue;

    const source = readFileSync(join(CONTENT_DIR, filename), 'utf8');
    const frontmatter = source.split(/^---$/m)[1] || '';
    const base = filename.replace(/\.mdx$/, '');
    const en = frontmatterValue(frontmatter, 'slug') || base;

    slugs.set(base, { en, vi: frontmatterValue(frontmatter, 'slug_vi') || en });
  }

  return slugs;
}

export const legacyPostRedirects = () => {
  const slugs = readPostSlugs();
  const redirects = [];

  for (const { from, lang, file } of LEGACY_POSTS) {
    const post = slugs.get(file);
    if (!post) {
      throw new Error(
        `legacy-post-redirects: "${from}" points at content/blog/${file}.mdx, which does not exist`
      );
    }

    const source = lang === 'vi' ? `/vi/posts/${from}` : `/posts/${from}`;
    const destination = `/${lang}/posts/${post[lang]}`;

    // Most Vietnamese slugs survived the migration unchanged, so the old URL is
    // already where the post lives. /vi/posts/* is a real route and redirects run
    // before routing, so emitting these would be an infinite loop rather than a
    // no-op.
    if (source === destination) continue;

    // Likewise for English slugs that never changed — the catch-all below produces
    // exactly this rule, so an explicit copy would only be noise.
    if (lang === 'en' && from === post.en) continue;

    redirects.push({ source, destination, statusCode: 301 });
  }

  // English legacy URLs whose slug never changed. Must stay last: Next.js applies
  // redirects in order, and the explicit rules above cover the slugs that did change.
  // There is deliberately no /vi/posts/:slug equivalent — that would match the real
  // route and loop.
  redirects.push({
    source: '/posts/:slug',
    destination: '/en/posts/:slug',
    statusCode: 301,
  });

  return redirects;
};
