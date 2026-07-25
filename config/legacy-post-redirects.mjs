/**
 * Permanent redirects from the retired WordPress post URLs to their v2 equivalents.
 *
 * The old site served every post from /posts/<slug> with no locale prefix; the
 * language was carried by the slug itself, Vietnamese posts ending in "-vi".
 * Slugs changed during the import, so each old URL is mapped explicitly rather
 * than rewritten by pattern.
 *
 * 301 rather than 308: this is a content migration, and 301 is what crawlers and
 * SEO tooling expect for a permanently moved page.
 */

/** @type {{ from: string, lang: 'en' | 'vi', slug: string }[]} */
const LEGACY_POSTS = [
  // An Expert Guide to Get the Perfect Wedding Suit
  { from: 'an-expert-guide-to-get-the-perfect-wedding-suit', lang: 'en', slug: 'wedding-suit-guide' },
  { from: 'nhung-dieu-chu-re-can-biet-de-chon-duoc-bo-suit-hoan-hao-vi', lang: 'vi', slug: 'wedding-suit-guide' },
  // 10 Common Wedding Makeup Mistakes You Should Avoid
  { from: '10-common-wedding-makeup-mistakes-you-should-avoid', lang: 'en', slug: 'wedding-makeup-mistakes' },
  { from: '10-loi-trang-diem-pho-bien-cac-co-dau-nen-tranh-vi', lang: 'vi', slug: 'wedding-makeup-mistakes' },
  // Do & Don’t – for a Meaningful Getting-Ready
  { from: 'do-dont-for-a-meaningful-getting-ready', lang: 'en', slug: 'getting-ready-dos-and-donts' },
  { from: 'nhung-dieu-nen-va-khong-nen-cho-buoi-getting-ready-tron-ven-vi', lang: 'vi', slug: 'getting-ready-dos-and-donts' },
  // A Meraki’s Checklist for Vietnamese Ceremonies and Weddings
  { from: 'checklist-chi-tiet-nhung-viec-can-lam-cho-dam-hoi-va-dam-cuoi', lang: 'en', slug: 'vietnamese-ceremony-checklist' },
  { from: 'checklist-chi-tiet-nhung-viec-can-lam-cho-dam-hoi-va-dam-cuoi-vi', lang: 'vi', slug: 'vietnamese-ceremony-checklist' },
  // The Ins and Outs of Intimate Weddings
  { from: 'the-ins-and-outs-of-intimate-weddings', lang: 'en', slug: 'intimate-weddings' },
  { from: 'intimate-wedding-mot-tiec-cuoi-than-mat-dien-ra-nhu-the-nao-vi', lang: 'vi', slug: 'intimate-weddings' },
  // Wedding Day Ultimate Packing Checklist for Brides and Grooms
  { from: 'wedding-day-ultimate-packing-checklist-for-brides-and-grooms', lang: 'en', slug: 'wedding-day-packing-checklist' },
  { from: 'co-dau-chu-re-can-mang-theo-vat-dung-nao-trong-ngay-cuoi-vi', lang: 'vi', slug: 'wedding-day-packing-checklist' },
  // Color Coordination for Your Wedding Party
  { from: 'color-coordination-for-your-wedding-party', lang: 'en', slug: 'wedding-party-colour-coordination' },
  { from: 'gam-mau-trong-trang-phuc-phu-dau-phu-re-vi', lang: 'vi', slug: 'wedding-party-colour-coordination' },
  // How to Entertain & Manage Kids in Wedding?
  { from: 'how-to-entertain-manage-kids-in-wedding', lang: 'en', slug: 'entertaining-kids-at-weddings' },
  { from: 'nhung-hoat-dong-danh-cho-vi-khach-nhi-trong-dam-cuoi-vi', lang: 'vi', slug: 'entertaining-kids-at-weddings' },
  // Beach Wedding and Mountain Wedding. Which Is Most Suitable for You?
  { from: 'beach-wedding-and-mountain-wedding', lang: 'en', slug: 'beach-vs-mountain-wedding' },
  { from: 'dia-diem-destinations-wedding-nao-se-phu-hop-voi-ban-vi', lang: 'vi', slug: 'beach-vs-mountain-wedding' },
  // Wedding Cocktail Hour
  { from: 'wedding-cocktail-hour', lang: 'en', slug: 'wedding-cocktail-hour' },
  { from: 'cung-meraki-tim-hieu-ve-tiec-cocktail-vi', lang: 'vi', slug: 'wedding-cocktail-hour' },
  // Wedding Bathroom Basket Checklist
  { from: 'bathroom-basket', lang: 'en', slug: 'wedding-bathroom-basket' },
  { from: 'checklist-vat-dung-can-thiet-cho-khach-moi-vi', lang: 'vi', slug: 'wedding-bathroom-basket' },
  // Wedding Round Table vs Long (Banquet) Table
  { from: 'roundtable-vs-longtable', lang: 'en', slug: 'round-vs-long-tables' },
  { from: 'ban-tron-vs-ban-dai-vi', lang: 'vi', slug: 'round-vs-long-tables' },
  // Head Table or Sweetheart Table
  { from: 'headtable-vs-sweetheart-table-en', lang: 'en', slug: 'head-vs-sweetheart-table' },
  { from: 'head-vs-sweetheart-vi', lang: 'vi', slug: 'head-vs-sweetheart-table' },
  // Tips for a Glowing Skin and Healthy Hair
  { from: 'tips-for-a-glowing-skin-and-healthy-hair', lang: 'en', slug: 'glowing-skin-and-healthy-hair' },
  { from: 'cham-soc-da-vi', lang: 'vi', slug: 'glowing-skin-and-healthy-hair' },
  // How to Throw the Perfect Bachelorette Party
  { from: 'how-to-throw-the-perfect-bachelorette-party', lang: 'en', slug: 'bachelorette-party' },
  { from: 'tiec-doc-than-vi', lang: 'vi', slug: 'bachelorette-party' },
  // Planning for a Perfect Wedding in the Rainy Season
  { from: 'wedding-in-the-rainy-season', lang: 'en', slug: 'rainy-season-wedding' },
  { from: 'wedding-in-rainy-season-vi', lang: 'vi', slug: 'rainy-season-wedding' },
  // What Does a Wedding Planner Really Do?
  { from: 'wedding-planner-job', lang: 'en', slug: 'what-a-wedding-planner-does' },
  { from: 'wedding-planner-job-2-vi', lang: 'vi', slug: 'what-a-wedding-planner-does' },
  // Wedding Vows: How to Write Yours
  { from: 'writing-vows-how-to-put-your-heart-into-words', lang: 'en', slug: 'wedding-vows-examples-and-guide' },
  { from: 'lam-sao-de-wedding-vows-duoc-chin-chu-va-cam-xuc-vi', lang: 'vi', slug: 'wedding-vows-examples-and-guide' },
  // 12 Fun Wedding Games to Break the Ice
  { from: 'wedding-games-en', lang: 'en', slug: 'wedding-games-ideas' },
  { from: 'wedding-games-vi', lang: 'vi', slug: 'wedding-games-ideas' },
  // ​​​​​​​​Western Wedding Ceremony: Full Guide to Traditions
  { from: 'western-wedding-traditions', lang: 'en', slug: 'western-wedding-ceremony-guide' },
  { from: 'cac-nghi-thuc-truyen-thong-cua-dam-cuoi-tai-phuong-tay-vi', lang: 'vi', slug: 'western-wedding-ceremony-guide' },
  // Destination Wedding in Phu Quoc: Complete Guide From Planner
  { from: 'the-planners-guide-to-getting-married-in-phu-quoc-island', lang: 'en', slug: 'phu-quoc-destination-wedding-guide' },
  { from: 'kinh-nghiem-to-chuc-tiec-cuoi-tai-dao-ngoc-phu-quoc-vi', lang: 'vi', slug: 'phu-quoc-destination-wedding-guide' },
  // 5 Wedding After Party Ideas That Guests Will Never Forget
  { from: 'how-to-plan-a-wedding-after-party', lang: 'en', slug: 'wedding-after-party-ideas' },
  { from: 'after-party-vi', lang: 'vi', slug: 'wedding-after-party-ideas' },
  // Unique Wedding Venues in Ho Chi Minh City
  { from: 'unique-wedding-venues-in-hcmc', lang: 'en', slug: 'wedding-venues-ho-chi-minh-city' },
  { from: 'unique-locations-vi', lang: 'vi', slug: 'wedding-venues-ho-chi-minh-city' },
  // Traditional Vietnamese Wedding: A-Z Guide to Customs, Timeline & Rituals
  { from: 'traditional-wedding-playbook', lang: 'en', slug: 'traditional-vietnamese-wedding-guide' },
];

export const legacyPostRedirects = () =>
  LEGACY_POSTS.map(({ from, lang, slug }) => ({
    source: `/posts/${from}`,
    destination: `/${lang}/blog/${slug}`,
    statusCode: 301,
  }));
