import type { FooterContact } from './footerContact';
import { absoluteUrl, SITE_URL } from './siteUrl';

/**
 * Stable node identifier for the brand. Article `publisher`/`author` and
 * Service `provider` point at this so every page describes one entity.
 */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

/**
 * Legal/trading name. Matches the footer copyright line
 * ("Copyright © {year} Meraki Wedding Planner") and the OpenGraph `siteName`
 * already used across the app.
 */
export const ORGANIZATION_NAME = 'Meraki Wedding Planner';

/** Logo lives in `public/`, so it must not be resolved through the S3 helper. */
const DEFAULT_LOGO = '/logo.svg';

/** Square brand mark from `public/`, used where a non-SVG image is expected. */
const BRAND_IMAGE = '/icon-512.png';

export interface OrganizationSchemaInput extends Pick<
  FooterContact,
  'logo' | 'email' | 'telephone' | 'sameAs'
> {
  lang: string;
}

/**
 * Minimal Organization reference for embedding as `publisher`/`provider` on
 * pages that do not carry the full node.
 */
export function organizationReference(lang: string) {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    url: absoluteUrl(`/${lang}`),
  };
}

export function buildOrganizationSchema({
  lang,
  logo,
  email,
  telephone,
  sameAs,
}: OrganizationSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    url: absoluteUrl(`/${lang}`),
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(logo || DEFAULT_LOGO),
    },
    image: absoluteUrl(BRAND_IMAGE),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(email ? { email } : {}),
    ...(telephone ? { telephone } : {}),
  };
}
