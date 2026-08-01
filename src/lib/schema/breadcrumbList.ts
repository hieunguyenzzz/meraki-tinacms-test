import { absoluteUrl } from './siteUrl';

export interface BreadcrumbItem {
  name: string;
  /** Absolute URL. */
  url: string;
}

export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Localised labels for the two crumbs above a detail page.
 *
 * These mirror `navItems` in `src/components/Header.tsx` and the `title_en` /
 * `title_vi` of `content/blog-listing/index.mdx` and
 * `content/journal-listing/index.mdx`. Header is a client component so its
 * array cannot be imported into a server module — keep the two in sync.
 */
const SECTION_LABELS = {
  home: { en: 'Home', vi: 'Trang chủ' },
  blog: { en: 'Blog', vi: 'Blog' },
  journal: { en: 'Journals', vi: 'Nhật ký' },
} as const;

export type BreadcrumbSection = 'blog' | 'journal';

/**
 * Home > Section > Page trail for a blog post or journal entry.
 *
 * `detailSegment` exists because blog detail does not live under the listing it
 * belongs to: posts are served from /[lang]/posts/<slug> so the URLs the old site
 * had indexed keep resolving, while the listing stays at /[lang]/blog. Journal
 * needs no override, so it defaults to `section`.
 */
export function buildDetailBreadcrumbSchema({
  lang,
  section,
  detailSegment = section,
  pageName,
  pageSlug,
}: {
  lang: string;
  section: BreadcrumbSection;
  detailSegment?: string;
  pageName: string;
  pageSlug: string;
}) {
  const locale = lang === 'vi' ? 'vi' : 'en';

  return buildBreadcrumbListSchema([
    { name: SECTION_LABELS.home[locale], url: absoluteUrl(`/${lang}`) },
    {
      name: SECTION_LABELS[section][locale],
      url: absoluteUrl(`/${lang}/${section}`),
    },
    {
      name: pageName,
      url: absoluteUrl(`/${lang}/${detailSegment}/${pageSlug}`),
    },
  ]);
}
