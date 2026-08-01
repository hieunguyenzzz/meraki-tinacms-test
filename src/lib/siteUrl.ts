/**
 * Canonical origin used by robots.txt and sitemap.xml.
 * No trailing slash.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://v2.merakiweddingplanner.com'
).replace(/\/$/, '');
