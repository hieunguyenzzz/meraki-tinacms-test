/**
 * Fallback alt text for content images whose author-written alt is still blank.
 *
 * Most gallery images in `content/` ship with empty `alt_en`/`alt_vi`, which
 * forfeits Google Images and leaves screen readers with nothing. Until those
 * fields are populated by hand, derive something descriptive from context the
 * page already has (couple, venue, location, or post title) and append a
 * per-page sequence number so one gallery does not announce the same string
 * dozens of times.
 */

/** Base phrase in both site languages, without the sequence suffix. */
export interface AltFallback {
  en: string;
  vi: string;
}

const MAX_BASE_LENGTH = 110;

function clean(value?: string | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function truncate(value: string): string {
  return value.length > MAX_BASE_LENGTH
    ? `${value.slice(0, MAX_BASE_LENGTH).trimEnd()}…`
    : value;
}

interface JournalAltSource {
  couple_names?: string | null;
  location?: string | null;
  wedding_details?: {
    venue?: string | null;
    location?: string | null;
  } | null;
}

/** e.g. "Claire & Luis wedding at Lan Viên Cố Tích & Le Cercle Hue in Huế" */
export function journalAltFallback(
  journal: JournalAltSource
): AltFallback | undefined {
  const couple = clean(journal?.couple_names);
  const venue = clean(journal?.wedding_details?.venue);
  const location =
    clean(journal?.location) || clean(journal?.wedding_details?.location);

  if (!couple && !venue && !location) return undefined;

  const en = [
    couple ? `${couple} wedding` : 'Wedding',
    venue ? `at ${venue}` : '',
    location ? `in ${location}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const vi = [
    couple ? `Đám cưới ${couple}` : 'Đám cưới',
    venue ? `tại ${venue}` : '',
    location ? `ở ${location}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return { en: truncate(en), vi: truncate(vi) };
}

interface BlogAltSource {
  title_en?: string | null;
  title_vi?: string | null;
}

/** Blog posts have no venue or couple — the localised post title is the context. */
export function blogAltFallback(blog: BlogAltSource): AltFallback | undefined {
  const en = clean(blog?.title_en);
  const vi = clean(blog?.title_vi) || en;

  if (!en && !vi) return undefined;

  return { en: truncate(en || vi), vi: truncate(vi) };
}

/**
 * Resolve the alt for one image: the author's text when present, otherwise the
 * fallback phrase plus `sequence` (1-based, page-wide) to keep each image
 * distinct. Returns '' when there is no context at all, which leaves the image
 * decorative rather than mislabelled.
 */
export function resolveImageAlt(
  authored: string | null | undefined,
  fallback: AltFallback | undefined,
  lang: string,
  sequence?: number
): string {
  const written = clean(authored);
  if (written) return written;

  const base = clean(lang === 'vi' ? fallback?.vi : fallback?.en);
  if (!base) return '';

  if (typeof sequence !== 'number' || !Number.isFinite(sequence)) return base;

  return `${base} — ${lang === 'vi' ? 'ảnh' : 'photo'} ${sequence}`;
}
