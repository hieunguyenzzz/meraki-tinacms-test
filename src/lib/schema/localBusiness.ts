import type { FooterContact } from './footerContact';
import { ORGANIZATION_NAME } from './organization';
import { absoluteUrl, SITE_URL } from './siteUrl';

export const LOCAL_BUSINESS_ID = `${SITE_URL}/#localbusiness`;

/** Square brand mark from `public/` — Google expects an image for a business. */
const BUSINESS_IMAGE = '/icon-512.png';

/**
 * The footer keeps the address as one line, e.g.
 * "No. 64, 37 Street, Binh Trung Ward, Ho Chi Minh City".
 * The last comma-separated part is the city, everything before it is the
 * street address. If there is no comma the whole value stays as the street
 * address rather than guessing at a locality.
 */
export function parsePostalAddress(address: string) {
  const parts = address
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    return { streetAddress: address.trim() };
  }

  return {
    streetAddress: parts.slice(0, -1).join(', '),
    addressLocality: parts[parts.length - 1],
  };
}

export interface LocalBusinessSchemaInput extends Pick<
  FooterContact,
  'address' | 'mapUrl' | 'email' | 'telephone' | 'sameAs'
> {
  lang: string;
}

export function buildLocalBusinessSchema({
  lang,
  address,
  mapUrl,
  email,
  telephone,
  sameAs,
}: LocalBusinessSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': LOCAL_BUSINESS_ID,
    name: ORGANIZATION_NAME,
    url: absoluteUrl(`/${lang}`),
    image: absoluteUrl(BUSINESS_IMAGE),
    ...(address
      ? {
          address: {
            '@type': 'PostalAddress',
            ...parsePostalAddress(address),
            // Not stored in the footer, but the address is a Ho Chi Minh City
            // one and the business operates only in Vietnam.
            addressCountry: 'VN',
          },
        }
      : {}),
    ...(mapUrl ? { hasMap: mapUrl } : {}),
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
