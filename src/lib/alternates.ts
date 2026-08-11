/**
 * Canonical URL and hreflang pair for a route that lives at the same path in
 * both locales — which is every route except the paginated listings.
 *
 * Without the `languages` pair nothing tells Google that /en/about and /vi/about
 * are translations rather than competing pages, so the two can cannibalise each
 * other in search results.
 *
 * Paths stay relative: `metadataBase` in src/app/baseMetadata.ts resolves them,
 * which keeps the host in one place. The blog and journal listings build their own
 * because they have to fold `?page=N` into the canonical — see
 * src/lib/listingPagination.ts.
 */
export function localeAlternates(lang: string, path = '') {
  // Normalised so an unsupported locale cannot emit itself as the canonical.
  const locale = lang === 'vi' ? 'vi' : 'en';

  return {
    canonical: `/${locale}${path}`,
    languages: xDefaultLanguages(path),
  };
}

/**
 * The hreflang pair plus the x-default that tells Google which URL to serve a
 * searcher whose language matches neither locale.
 *
 * Only the homepage has a locale-neutral URL to point at: `/` detects the
 * browser language and forwards. Every other path exists solely under a locale
 * prefix, so English is the fallback.
 */
export function xDefaultLanguages(path = '') {
  return {
    en: `/en${path}`,
    vi: `/vi${path}`,
    'x-default': path === '' ? '/' : `/en${path}`,
  };
}
