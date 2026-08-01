/**
 * Absolute base URL for the site.
 *
 * JSON-LD consumers cannot resolve relative URLs, so every `url`/`@id` emitted
 * by the schema builders has to be fully qualified.
 *
 * NOTE: MWP-45 adds `src/lib/siteUrl.ts` for the same purpose. Once both
 * branches are merged, delete this module and import from there instead.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://v2.merakiweddingplanner.com'
).replace(/\/+$/, '');

/** Resolves a site-relative path to an absolute URL. Absolute input passes through. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Normalises the `[lang]` route param to a BCP 47 tag we actually support. */
export function toLanguageTag(lang: string): 'en' | 'vi' {
  return lang === 'vi' ? 'vi' : 'en';
}
