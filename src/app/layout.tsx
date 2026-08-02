import './globals.css';
import 'animate.css';
import type { Metadata } from 'next';
import Analytics from '../components/Analytics';
import {
  DEFAULT_SHARE_IMAGE,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '../lib/shareImage';
import { SITE_URL } from '../lib/siteUrl';

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
        />
      </head>
      <body className='bg-background-1'>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
