/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '../../../../tina/__generated__/client';
import BlogListingClient from '../../../components/BlogListingClient';
import {
  listingPageUrl,
  parsePageParam,
  totalListingPages,
} from '../../../lib/listingPagination';

interface Props {
  params: { lang: string };
  searchParams: { page?: string | string[] };
}

// Enable static generation with revalidation
export const revalidate = 3600;

// Date gate: keeps the legacy posts off the blog listing.
//
// The 16 posts migrated from the old WordPress site are deliberately published —
// Google has their /posts/ URLs indexed and they must keep resolving — but they are
// not part of the current blog and should not appear here. `published` cannot express
// that, since it is what makes them reachable in the first place, so the listing
// filters on date instead: the migrated archive ends 2021-10-12 and the first post
// authored in v2 is 2026-05-31, leaving an unambiguous gap.
const LISTING_START_DATE = Date.parse('2022-01-01T00:00:00Z');

// A post with no date is shown: `published_date` is optional in the collection
// schema, so failing open keeps a newly created post from silently going missing.
const isCurrentPost = (publishedDate?: string | null) => {
  if (!publishedDate) return true;

  const timestamp = Date.parse(publishedDate);
  return Number.isNaN(timestamp) || timestamp >= LISTING_START_DATE;
};

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { lang } = params;
  // Each ?page=N is its own indexable URL, so it self-canonicalises rather
  // than looking like a duplicate of page 1.
  const page = parsePageParam(searchParams?.page);
  const alternates = {
    canonical: listingPageUrl(`/${lang}/blog`, page),
    languages: {
      en: listingPageUrl('/en/blog', page),
      vi: listingPageUrl('/vi/blog', page),
    },
  };

  try {
    const listingResponse = await client.queries.blogListing({
      relativePath: 'index.mdx',
    });
    const listing = listingResponse.data.blogListing;
    const seo = lang === 'en' ? listing.seo_en : listing.seo_vi;
    const title = lang === 'en' ? listing.title_en : listing.title_vi;
    return {
      title: seo?.title || `${title} - Meraki Wedding Planner`,
      description: seo?.description || '',
      alternates,
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
      alternates,
    };
  }
}

export default async function BlogPage({ params, searchParams }: Props) {
  const { lang } = params;
  const initialPage = parsePageParam(searchParams?.page);

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const relativePath = 'index.mdx';
  const listingResponse = await client.queries.blogListing({ relativePath });

  let blogs: any[] = [];
  try {
    const blogList = await client.queries.blogConnection({
      filter: { published: { eq: true } },
    });
    blogs = (blogList.data.blogConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map((edge) => edge.node)
      .filter((node) => isCurrentPost(node?.published_date));
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  // Out-of-range pages would otherwise serve a clamped copy of the last page
  // under their own canonical, i.e. duplicate content.
  if (initialPage > 1 && initialPage > totalListingPages(blogs.length)) {
    notFound();
  }

  return (
    <BlogListingClient
      data={listingResponse.data}
      query={listingResponse.query}
      variables={{ relativePath }}
      lang={lang}
      blogs={blogs}
      initialPage={initialPage}
    />
  );
}
