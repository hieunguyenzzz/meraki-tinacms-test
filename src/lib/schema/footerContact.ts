/**
 * Pulls the business contact details out of `content/footer/index.mdx` so the
 * schema builders never have to know the TinaCMS document shape.
 *
 * The footer stores contact rows as free-text labels plus a link, e.g.
 *   label_en: 'Address: No. 64, 37 Street, Binh Trung Ward, Ho Chi Minh City'
 *   url:      'https://www.google.com/maps/search/?api=1&query=...'
 * so the URL scheme (`tel:`, `mailto:`, `http`) is what identifies each row,
 * not its position in the list.
 */

interface FooterContactItem {
  label_en?: string | null;
  value?: string | null;
  url?: string | null;
}

interface FooterSocialLink {
  url?: string | null;
}

export interface FooterDocument {
  logo?: string | null;
  contact_items?: (FooterContactItem | null)[] | null;
  social_links?: (FooterSocialLink | null)[] | null;
}

export interface FooterContact {
  /** Footer logo path, e.g. `/logo.svg`. */
  logo?: string;
  /** E.164 phone number taken from the `tel:` link. */
  telephone?: string;
  /** Email address taken from the `mailto:` link. */
  email?: string;
  /** Raw address label with its `Address:` prefix stripped. */
  address?: string;
  /** Google Maps link for the address row. */
  mapUrl?: string;
  /** Social profile URLs, for `sameAs`. */
  sameAs: string[];
}

/** Strips a leading `Label:` prefix from a footer contact label. */
const stripLabelPrefix = (label: string) =>
  label.replace(/^[^:]*:\s*/, '').trim();

export function extractFooterContact(
  footer: FooterDocument | null | undefined
): FooterContact {
  const items = (footer?.contact_items || []).filter(
    (item): item is FooterContactItem => Boolean(item)
  );

  const telItem = items.find((item) => item.url?.startsWith('tel:'));
  const mailItem = items.find((item) => item.url?.startsWith('mailto:'));
  const addressItem = items.find((item) => item.url?.startsWith('http'));

  const address = addressItem?.label_en
    ? stripLabelPrefix(addressItem.label_en)
    : undefined;

  const sameAs = (footer?.social_links || [])
    .map((link) => link?.url?.trim())
    .filter((url): url is string => Boolean(url));

  return {
    logo: footer?.logo || undefined,
    telephone: telItem?.url?.replace(/^tel:/, '').trim() || undefined,
    email: mailItem?.url?.replace(/^mailto:/, '').trim() || undefined,
    address: address || undefined,
    mapUrl: addressItem?.url || undefined,
    sameAs,
  };
}
