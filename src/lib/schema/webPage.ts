import { toLanguageTag } from './siteUrl';

/**
 * A WebPage node exists purely to carry `inLanguage` for the current locale.
 *
 * `inLanguage` is only valid on CreativeWork/Event in schema.org, so it cannot
 * be hung off Organization, LocalBusiness, Service or BreadcrumbList. WebPage
 * is a CreativeWork, so this is the correct place for it.
 */
export interface WebPageSchemaInput {
  lang: string;
  /** Absolute canonical URL of the page. */
  url: string;
  name: string;
  description?: string | null;
}

export function buildWebPageSchema({
  lang,
  url,
  name,
  description,
}: WebPageSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name,
    ...(description ? { description } : {}),
    inLanguage: toLanguageTag(lang),
  };
}
