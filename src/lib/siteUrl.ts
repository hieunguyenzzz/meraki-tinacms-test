/**
 * Canonical origin for the site. Feeds `metadataBase`, and through that every
 * canonical, hreflang and OG URL, plus robots.txt, sitemap.xml and the JSON-LD
 * builders. No trailing slash.
 *
 * The apex, not v2: v2.merakiweddingplanner.com was decommissioned on
 * 2026-08-02 and now 404s at the proxy, while the apex serves the app. Leaving
 * the old default in place pointed every canonical and all 184 sitemap URLs at
 * a dead host — an instruction to Google to drop the site.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://merakiweddingplanner.com'
).replace(/\/$/, '');
