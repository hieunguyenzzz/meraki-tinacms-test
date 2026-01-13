/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from "../../../../tina/__generated__/client";
import JournalListingClient from '../../../components/JournalListingClient';
import fs from 'fs';
import path from 'path';

interface Props {
  params: { lang: string };
}

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour (ISR)

// Pre-generate both language versions
export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export default async function JournalPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  // Fetch page content
  const relativePath = 'journal-listing.mdx';
  const pageResponse = await client.queries.page({
    relativePath,
  });

  // Fetch journals
  let journals: any[] = [];
  try {
    const journalList = await client.queries.journalConnection({
      filter: {
        published: {
          eq: true,
        },
      },
    });
    
    // Filter and Sort
    const edges = (journalList.data.journalConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null);

    journals = edges.sort((a, b) => {
      const nodeA = a.node as any;
      const nodeB = b.node as any;

      // 1. Priority check (Ascending: 1 -> 100)
      const priorityA = nodeA.listing_priority;
      const priorityB = nodeB.listing_priority;

      // Both have priority -> Compare them
      if (typeof priorityA === 'number' && typeof priorityB === 'number') {
        return priorityA - priorityB;
      }
      // Only A has priority -> A comes first
      if (typeof priorityA === 'number') return -1;
      // Only B has priority -> B comes first
      if (typeof priorityB === 'number') return 1;

      // 2. Date check (Filesystem birthtime - Descending ie Newest First)
      const getFileDate = (relativePath: string) => {
        try {
          const fullPath = path.join(process.cwd(), 'content/journal', relativePath);
          const stats = fs.statSync(fullPath);
          return stats.birthtimeMs; 
        } catch (e) {
          return 0;
        }
      };

      const dateA = getFileDate(nodeA._sys.relativePath);
      const dateB = getFileDate(nodeB._sys.relativePath);

      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error fetching journals:', error);
    // journals will remain empty array
  }

  return (
    <JournalListingClient
      data={pageResponse.data}
      query={pageResponse.query}
      variables={{ relativePath }}
      lang={lang}
      journals={journals}
    />
  );
}
