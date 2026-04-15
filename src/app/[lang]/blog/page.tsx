/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../tina/__generated__/client';
import BlogListingClient from '../../../components/BlogListingClient';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

// Enable static generation with revalidation
export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  try {
    const pageResponse = await client.queries.page({
      relativePath: 'blog-listing.mdx',
    });
    const page = pageResponse.data.page;
    const seo = lang === 'en' ? page.seo_en : page.seo_vi;
    const title = lang === 'en' ? page.title_en : page.title_vi;
    return {
      title: seo?.title || `${title} - Meraki Wedding Planner`,
      description: seo?.description || '',
    };
  } catch {
    return {
      title:
        lang === 'en'
          ? 'Blog - Meraki Wedding Planner'
          : 'Blog - Meraki Wedding Planner',
      description:
        lang === 'en'
          ? 'Wedding tips, inspiration, and behind-the-scenes stories from Meraki Wedding Planner'
          : 'Mẹo cưới, cảm hứng và những câu chuyện hậu trường từ Meraki Wedding Planner',
    };
  }
}

export default async function BlogPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const relativePath = 'blog-listing.mdx';
  const pageResponse = await client.queries.page({ relativePath });

  let blogs: any[] = [];
  try {
    const blogList = await client.queries.blogConnection({
      filter: { published: { eq: true } },
    });
    blogs = (blogList.data.blogConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map((edge) => edge.node);
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  return (
    <BlogListingClient
      data={pageResponse.data}
      query={pageResponse.query}
      variables={{ relativePath }}
      lang={lang}
      blogs={blogs}
    />
  );
}

