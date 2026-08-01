/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { client } from "../../../../tina/__generated__/client";
import JournalListingClient from '../../../components/JournalListingClient';
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
export const revalidate = 3600; // Revalidate every hour (ISR)

// Pre-generate both language versions
export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

// Each ?page=N is its own indexable URL, so it self-canonicalises rather than
// looking like a duplicate of page 1.
export function generateMetadata({ params, searchParams }: Props): Metadata {
  const { lang } = params;
  const page = parsePageParam(searchParams?.page);

  return {
    alternates: {
      canonical: listingPageUrl(`/${lang}/journal`, page),
      languages: {
        en: listingPageUrl('/en/journal', page),
        vi: listingPageUrl('/vi/journal', page),
      },
    },
  };
}

export default async function JournalPage({ params, searchParams }: Props) {
  const { lang } = params;
  const initialPage = parsePageParam(searchParams?.page);

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  // Fetch page content
  const relativePath = 'index.mdx';
  const journalListingResponse = await client.queries.journalListing({
    relativePath,
  });

  // Fetch journals
  let journals: any[] = [];
  try {
    const journalEdges: any[] = [];
    let after: string | undefined;
    let hasNextPage = true;

    while (hasNextPage) {
      const journalList = await client.queries.journalConnection({
        first: 50,
        after,
        filter: {
          published: {
            eq: true,
          },
        },
      });

      const connection = journalList.data.journalConnection;
      journalEdges.push(...(connection.edges || []));
      hasNextPage = connection.pageInfo.hasNextPage;

      const nextCursor = connection.pageInfo.endCursor;
      if (hasNextPage && (!nextCursor || nextCursor === after)) {
        throw new Error('Journal pagination did not return a new cursor');
      }
      after = nextCursor;
    }

    // Map edges and attach fileDate
    const getFileDate = (relativePath: string) => {
      try {
        const fullPath = path.join(process.cwd(), 'content/journal', relativePath);
        const stats = fs.statSync(fullPath);
        return stats.birthtimeMs;
      } catch (e) {
        return 0;
      }
    };

    journals = journalEdges
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map((edge) => {
        const node = edge.node as any;
        const relativePath = node._sys?.relativePath || '';
        return {
          ...edge,
          fileDate: getFileDate(relativePath),
        };
      });
  } catch (error) {
    console.error('Error fetching journals:', error);
    // journals will remain empty array
  }

  // Out-of-range pages would otherwise serve a clamped copy of the last page
  // under their own canonical, i.e. duplicate content.
  if (initialPage > 1 && initialPage > totalListingPages(journals.length)) {
    notFound();
  }

  return (
    <JournalListingClient
      data={journalListingResponse.data}
      query={journalListingResponse.query}
      variables={{ relativePath }}
      lang={lang}
      journals={journals}
      initialPage={initialPage}
    />
  );
}
