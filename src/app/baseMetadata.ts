import type { Metadata } from 'next';
import {
  DEFAULT_SHARE_IMAGE,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '../lib/shareImage';
import { SITE_URL } from '../lib/siteUrl';

// Shared by both root layouts. There are two of them because <html lang> has to
// follow the [lang] segment, and only a root layout may render <html> — so the
// locale tree and the bare routes (/ and the 404) each need their own.
export const baseMetadata: Metadata = {
  // Canonicals, hreflang and OG URLs all resolve against this. It must agree
  // with the host in robots.txt and sitemap.xml — see src/lib/siteUrl.ts.
  metadataBase: new URL(SITE_URL),
  title: 'Meraki Wedding Planner',
  description: 'Wedding planning services',
  // Default link-preview image for every route. Pages that declare their own
  // openGraph replace this wholesale, so journal and blog detail set their own.
  openGraph: {
    images: [
      {
        url: DEFAULT_SHARE_IMAGE,
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_SHARE_IMAGE],
  },
  // Google reads the 48x48 entry inside favicon.ico for the search result icon;
  // the PNGs cover browser tabs, Android and iOS home screens.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: { url: '/apple-icon.png', sizes: '180x180' },
  },
};
