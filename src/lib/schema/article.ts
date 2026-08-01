import { resolveImageUrl } from '../image';
import { organizationReference } from './organization';
import { toLanguageTag } from './siteUrl';

export interface ArticleSchemaInput {
  lang: string;
  /** Absolute canonical URL of the post. */
  url: string;
  headline: string;
  description?: string | null;
  /** `featured_image` from the blog frontmatter. */
  image?: string | null;
  /** `published_date` from the blog frontmatter (ISO 8601). */
  datePublished?: string | null;
  /** `categories` from the blog frontmatter. */
  categories?: (string | null)[] | null;
  /** `tags` from the blog frontmatter. */
  tags?: (string | null)[] | null;
}

const clean = (values?: (string | null)[] | null) =>
  (values || [])
    .map((value) => value?.trim())
    .filter((value): value is string => Boolean(value));

export function buildArticleSchema({
  lang,
  url,
  headline,
  description,
  image,
  datePublished,
  categories,
  tags,
}: ArticleSchemaInput) {
  const sections = clean(categories);
  const keywords = clean(tags);
  const publisher = organizationReference(lang);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    headline,
    ...(description ? { description } : {}),
    ...(image ? { image: resolveImageUrl(image) } : {}),
    // No `dateModified` field exists in the blog collection, so it is omitted
    // rather than mirrored from `published_date`.
    ...(datePublished ? { datePublished } : {}),
    author: publisher,
    publisher,
    ...(sections.length > 0 ? { articleSection: sections } : {}),
    ...(keywords.length > 0 ? { keywords: keywords.join(', ') } : {}),
    inLanguage: toLanguageTag(lang),
  };
}
