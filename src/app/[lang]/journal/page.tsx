/* eslint-disable @typescript-eslint/no-explicit-any */
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
    // Filter out null values and ensure we have valid nodes
    journals = (journalList.data.journalConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map((edge) => edge);
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
