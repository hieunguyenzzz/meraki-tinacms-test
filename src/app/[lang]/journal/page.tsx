/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';
import { client } from "../../../../tina/__generated__/client";
import JournalListingClient from '../../../components/JournalListingClient';

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
  const relativePath = 'index.mdx';
  const journalListingResponse = await client.queries.journalListing({
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

    journals = (journalList.data.journalConnection.edges || [])
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
