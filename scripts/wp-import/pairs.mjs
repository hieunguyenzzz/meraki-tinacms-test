/**
 * Topic pairing between the English and Vietnamese WordPress posts.
 *
 * WordPress stored each language as its own post, tagged only by the category
 * "English" or "Vietnamese" - there is no relation between the two rows. The v2
 * blog schema is one bilingual document per topic, so the pairing has to be
 * stated explicitly. Pairs were matched on title and publish date.
 */

/** [englishSlug, vietnameseSlug, newSlug] */
export const PAIRS = [
  [
    'an-expert-guide-to-get-the-perfect-wedding-suit',
    'nhung-dieu-chu-re-can-biet-de-chon-duoc-bo-suit-hoan-hao-vi',
    'wedding-suit-guide',
  ],
  [
    '10-common-wedding-makeup-mistakes-you-should-avoid',
    '10-loi-trang-diem-pho-bien-cac-co-dau-nen-tranh-vi',
    'wedding-makeup-mistakes',
  ],
  [
    'do-dont-for-a-meaningful-getting-ready',
    'nhung-dieu-nen-va-khong-nen-cho-buoi-getting-ready-tron-ven-vi',
    'getting-ready-dos-and-donts',
  ],
  [
    'checklist-chi-tiet-nhung-viec-can-lam-cho-dam-hoi-va-dam-cuoi',
    'checklist-chi-tiet-nhung-viec-can-lam-cho-dam-hoi-va-dam-cuoi-vi',
    'vietnamese-ceremony-checklist',
  ],
  [
    'the-ins-and-outs-of-intimate-weddings',
    'intimate-wedding-mot-tiec-cuoi-than-mat-dien-ra-nhu-the-nao-vi',
    'intimate-weddings',
  ],
  [
    'wedding-day-ultimate-packing-checklist-for-brides-and-grooms',
    'co-dau-chu-re-can-mang-theo-vat-dung-nao-trong-ngay-cuoi-vi',
    'wedding-day-packing-checklist',
  ],
  [
    'color-coordination-for-your-wedding-party',
    'gam-mau-trong-trang-phuc-phu-dau-phu-re-vi',
    'wedding-party-colour-coordination',
  ],
  [
    'how-to-entertain-manage-kids-in-wedding',
    'nhung-hoat-dong-danh-cho-vi-khach-nhi-trong-dam-cuoi-vi',
    'entertaining-kids-at-weddings',
  ],
  [
    'beach-wedding-and-mountain-wedding',
    'dia-diem-destinations-wedding-nao-se-phu-hop-voi-ban-vi',
    'beach-vs-mountain-wedding',
  ],
  [
    'wedding-cocktail-hour',
    'cung-meraki-tim-hieu-ve-tiec-cocktail-vi',
    'wedding-cocktail-hour',
  ],
  [
    'bathroom-basket',
    'checklist-vat-dung-can-thiet-cho-khach-moi-vi',
    'wedding-bathroom-basket',
  ],
  [
    'roundtable-vs-longtable',
    'ban-tron-vs-ban-dai-vi',
    'round-vs-long-tables',
  ],
  [
    'headtable-vs-sweetheart-table-en',
    'head-vs-sweetheart-vi',
    'head-vs-sweetheart-table',
  ],
  [
    'tips-for-a-glowing-skin-and-healthy-hair',
    'cham-soc-da-vi',
    'glowing-skin-and-healthy-hair',
  ],
  [
    'how-to-throw-the-perfect-bachelorette-party',
    'tiec-doc-than-vi',
    'bachelorette-party',
  ],
  [
    'wedding-in-the-rainy-season',
    'wedding-in-rainy-season-vi',
    'rainy-season-wedding',
  ],
  [
    'wedding-planner-job',
    'wedding-planner-job-2-vi',
    'what-a-wedding-planner-does',
  ],
];

/**
 * Topics already written by hand in content/blog. Their WordPress originals are
 * deliberately not imported - the existing posts are rewritten, not converted.
 */
export const SKIPPED = [
  ['writing-vows-how-to-put-your-heart-into-words', 'wedding-vows.mdx'],
  ['wedding-games-en', 'wedding-games-ideas.mdx'],
  ['western-wedding-traditions', 'western-wedding-ceremony-guide.mdx'],
  [
    'the-planners-guide-to-getting-married-in-phu-quoc-island',
    'phu-quoc-destination-wedding-guide.mdx',
  ],
  ['how-to-plan-a-wedding-after-party', 'wedding-after-party-ideas.mdx'],
  ['unique-wedding-venues-in-hcmc', 'wedding-venues-ho-chi-minh-city.mdx'],
  ['traditional-wedding-playbook', 'traditional-wedding.mdx'],
];
