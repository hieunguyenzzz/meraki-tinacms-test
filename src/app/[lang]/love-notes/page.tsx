import type { Metadata } from 'next';
import { client } from '../../../../tina/__generated__/client';
import LoveNotesClient from '../../../components/LoveNotesClient';

interface Props {
  params: { lang: string };
}

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour (ISR)

// Pre-generate both language versions
export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'vi' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  try {
    const listingResponse = await client.queries.loveNotesListing({
      relativePath: 'index.mdx',
    });
    const listing = listingResponse.data.loveNotesListing;
    const seo = lang === 'en' ? listing.seo_en : listing.seo_vi;
    const title = lang === 'en' ? listing.title_en : listing.title_vi;

    return {
      title: seo?.title || `${title} - Meraki Wedding Planner`,
      description: seo?.description || '',
    };
  } catch {
    return {
      title:
        lang === 'en'
          ? 'Love Notes - Meraki Wedding Planner'
          : 'Tri an - Meraki Wedding Planner',
      description:
        lang === 'en'
          ? 'Kind words and testimonials from our beautiful couples'
          : 'Nhung loi cam on va nhan xet tu cac cap doi cua Meraki',
    };
  }
}

export default async function LoveNotesPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const relativePath = 'index.mdx';
  const listingResponse = await client.queries.loveNotesListing({
    relativePath,
  });

  return (
    <LoveNotesClient
      data={listingResponse.data}
      query={listingResponse.query}
      variables={{ relativePath }}
      lang={lang}
    />
  );
}
