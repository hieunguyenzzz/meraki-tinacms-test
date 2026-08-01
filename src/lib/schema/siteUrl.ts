/**
 * Absolute URL helpers for the JSON-LD builders.
 *
 * JSON-LD consumers cannot resolve relative URLs, so every `url`/`@id` emitted
 * by the schema builders has to be fully qualified. The origin itself comes
 * from `src/lib/siteUrl.ts` — the single source shared with `metadataBase`,
 * robots.txt and sitemap.xml, so canonicals and structured data can never
 * disagree about which host the site is on.
 */
import { SITE_URL } from '../siteUrl';

export { SITE_URL };

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
