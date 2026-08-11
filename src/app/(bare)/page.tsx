import type { Metadata } from 'next';
import { client } from '../../../tina/__generated__/client';
import LanguageRedirect from '../../components/LanguageRedirect';
import { xDefaultLanguages } from '../../lib/alternates';
import {
  DEFAULT_SHARE_IMAGE,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '../../lib/shareImage';

export const revalidate = 3600;

const fallback = {
  title: 'Meraki Wedding Planner',
  description: 'Professional wedding planning services in Vietnam',
};

export async function generateMetadata(): Promise<Metadata> {
  // `/` is the x-default entry and self-canonicalises rather than pointing at
  // /en: it is the URL Google already ranks for the homepage, so pointing the
  // canonical elsewhere would hand away the position it holds today.
  //
  // It reuses the English SEO fields from content/page/index.mdx so the snippet
  // stays editable in Tina and cannot drift from the one /en shows.
  const alternates = { canonical: '/', languages: xDefaultLanguages() };

  let title = fallback.title;
  let description = fallback.description;

  try {
    const pageData = await client.queries.page({ relativePath: 'index.mdx' });
    const seo = pageData.data.page?.seo_en;
    title = seo?.title || title;
    description = seo?.description || description;
  } catch (error) {
    // Tina being unreachable must not cost the homepage its metadata entirely —
    // fall through to the defaults above.
    console.error('[home] failed to load SEO fields for /', error);
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Meraki Wedding Planner',
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
      title,
      description,
      images: [DEFAULT_SHARE_IMAGE],
    },
    robots: 'index, follow',
    alternates,
  };
}

export default function HomePage() {
  return <LanguageRedirect />;
}
