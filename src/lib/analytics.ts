/**
 * Event tracking, fanned out to both tools the site runs.
 *
 * Umami is the primary — it takes arbitrary named events with a flat property
 * bag. GA4 gets the same event so conversions show up alongside the acquisition
 * reports. Either can be absent (no env var, blocked by an ad blocker, script
 * still loading) and this stays silent rather than throwing into a click handler.
 */

type EventData = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
    gtag?: (
      command: string,
      targetOrName: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * The GA4 property and Umami site carried over from the old merakiweddingplanner
 * site, so the history stays continuous. These are public client-side
 * identifiers — they ship in the page source either way — not credentials.
 *
 * Defaulted in code rather than required from the environment: the deploy has no
 * analytics env vars set, and `NEXT_PUBLIC_*` is inlined at build time, so
 * without a default the tags simply would not render. Setting the env vars still
 * overrides these.
 */
const DEFAULT_GA_ID = 'G-152J4BFGVX';
const DEFAULT_UMAMI_SRC = 'https://umami.soundboxstore.com/script.js';
const DEFAULT_UMAMI_WEBSITE_ID = 'cb5bc549-bb67-4b05-8270-bdbca50ce5f2';

// The defaults apply to real builds only. `next dev` gets nothing unless the env
// vars are set explicitly, which keeps local traffic out of the live property.
const useDefaults = process.env.NODE_ENV === 'production';

const fromEnv = (value: string | undefined, fallback: string) =>
  value || (useDefaults ? fallback : '');

export const GA_ID = fromEnv(process.env.NEXT_PUBLIC_GA_ID, DEFAULT_GA_ID);
export const UMAMI_SRC = fromEnv(
  process.env.NEXT_PUBLIC_UMAMI_SRC,
  DEFAULT_UMAMI_SRC
);
export const UMAMI_WEBSITE_ID = fromEnv(
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  DEFAULT_UMAMI_WEBSITE_ID
);

/** Drops keys with no value so neither tool records empty properties. */
function compact(data?: EventData): EventData {
  if (!data) return {};

  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined && value !== '')
  );
}

export function trackEvent(name: string, data?: EventData): void {
  if (typeof window === 'undefined') return;

  const payload = compact(data);

  try {
    window.umami?.track(name, payload);
  } catch {
    // Analytics must never break the interaction that triggered it.
  }

  try {
    window.gtag?.('event', name, payload);
  } catch {
    // As above.
  }
}

/**
 * Classifies a clicked link and records it, if it leaves the site.
 *
 * Handled by one delegated listener rather than an onClick per component: the
 * links are spread across the footer, the enquiry page, the home Instagram grid
 * and the social-media page — and that last one is a server component, so it
 * could not take a handler anyway.
 *
 * Only the destination host is recorded, never the full URL or a mailto address.
 */
export function trackAnchorClick(anchor: HTMLAnchorElement): void {
  const href = anchor.getAttribute('href') || '';
  if (!href) return;

  if (href.startsWith('mailto:')) {
    trackEvent('contact_click', { method: 'email' });
    return;
  }

  if (href.startsWith('tel:')) {
    trackEvent('contact_click', { method: 'phone' });
    return;
  }

  // Relative and hash links are internal — pageviews already cover those.
  if (!/^https?:\/\//i.test(href)) return;

  let host: string;
  try {
    host = new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return;
  }

  if (host === window.location.hostname.replace(/^www\./, '')) return;

  if (host === 'wa.me' || host.endsWith('whatsapp.com')) {
    trackEvent('contact_click', { method: 'whatsapp' });
    return;
  }

  trackEvent('outbound_click', { domain: host });
}

/**
 * GA4 only sends a page_view on hard load. The App Router swaps pages client
 * side, so every soft navigation needs one explicitly or the whole journey
 * collapses into a single pageview. Umami's script handles this itself.
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined' || !GA_ID) return;

  try {
    window.gtag?.('event', 'page_view', {
      page_path: url,
      page_location: `${window.location.origin}${url}`,
      page_title: document.title,
    });
  } catch {
    // As above.
  }
}
