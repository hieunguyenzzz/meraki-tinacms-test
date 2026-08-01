/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { client } from "../../../../tina/__generated__/client";
import JournalListingClient from '../../../components/JournalListingClient';
import { truncate } from '../../../lib/richText';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour (ISR)

// Pre-generate both language versions
export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const isVi = params.lang === 'vi';

  try {
    const { data } = await client.queries.journalListing({
      relativePath: 'index.mdx',
    });
    const hero = data.journalListing.hero;
    const title = (isVi ? hero?.title_vi : hero?.title_en) || 'Journals';
    const description = isVi ? hero?.description_vi : hero?.description_en;

    return {
      title: `${title} - Meraki Wedding Planner`,
      description: truncate(description || '', 300) || undefined,
    };
  } catch {
    return {
      title: isVi
        ? 'Nhật ký - Meraki Wedding Planner'
        : 'Journals - Meraki Wedding Planner',
    };
  }
}

export default async function JournalPage({ params }: Props) {
  const { lang } = params;

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

  return (
    <JournalListingClient
      data={journalListingResponse.data}
      query={journalListingResponse.query}
      variables={{ relativePath }}
      lang={lang}
      journals={journals}
    />
  );
}
