'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useRef } from 'react';
import {
  GA_ID,
  UMAMI_SRC,
  UMAMI_WEBSITE_ID,
  trackAnchorClick,
  trackEvent,
  trackPageView,
} from '../lib/analytics';

/** Journal entries and blog posts — the pages worth measuring attention on. */
const DETAIL_PATH = /^\/(en|vi)\/(journal|posts)\/([^/]+)$/;

const SCROLL_MILESTONES = [25, 50, 75, 100];

/**
 * GA4 + Umami, carried over from the old site so the history stays continuous.
 *
 * Both are driven by env vars and render nothing when unset, which keeps local
 * dev and preview builds out of the production property.
 *
 * Note: this deliberately reads `window.location.search` rather than calling
 * `useSearchParams()`. That hook opts the entire tree out of static rendering,
 * which would silently turn every ISR page into a per-request render.
 */
export default function Analytics() {
  const pathname = usePathname();
  // The gtag config call already reports the first page; counting it again here
  // would double every session's landing page.
  const skippedInitial = useRef(false);

  useEffect(() => {
    if (!GA_ID) return;

    if (!skippedInitial.current) {
      skippedInitial.current = true;
      return;
    }

    trackPageView(`${pathname}${window.location.search}`);
  }, [pathname]);

  // One delegated listener for every outbound and contact link on the site.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (anchor) trackAnchorClick(anchor as HTMLAnchorElement);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Scroll depth, journal and post detail only. Re-armed per path so a soft
  // navigation to the next entry measures that entry rather than staying spent.
  useEffect(() => {
    const match = pathname?.match(DETAIL_PATH);
    if (!match) return;

    const [, , section, slug] = match;
    const contentType = section === 'posts' ? 'post' : 'journal';
    const reached = new Set<number>();

    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      // Too short to scroll — a 100% reading would be meaningless.
      if (scrollable <= 0) return;

      const percent = (window.scrollY / scrollable) * 100;

      for (const milestone of SCROLL_MILESTONES) {
        if (percent >= milestone && !reached.has(milestone)) {
          reached.add(milestone);
          trackEvent('scroll_depth', {
            depth: milestone,
            content_type: contentType,
            slug,
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy='afterInteractive'
          />
          <Script id='ga4-init' strategy='afterInteractive'>
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}

      {UMAMI_SRC && UMAMI_WEBSITE_ID && (
        <Script
          src={UMAMI_SRC}
          data-website-id={UMAMI_WEBSITE_ID}
          strategy='afterInteractive'
        />
      )}
    </>
  );
}
