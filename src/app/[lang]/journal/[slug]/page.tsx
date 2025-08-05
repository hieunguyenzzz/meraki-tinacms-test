import { client } from '../../../../../tina/__generated__/client';
import JournalClient from '../../../../components/JournalClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { data } = await client.queries.journal({
      relativePath: `${params.slug}.mdx`,
    });

    const title = data.journal.couple_names || 'Journal Entry';
    const subtitle = params.lang === 'vi' 
      ? data.journal.subtitle_vi 
      : data.journal.subtitle_en;

    return {
      title,
      description: subtitle || 'A beautiful wedding story',
    };
  } catch {
    return {
      title: 'Journal Entry Not Found',
    };
  }
}

export default async function JournalPage({ params }: PageProps) {
  const variables = { relativePath: `${params.slug}.mdx` };
  const query = `
    query Journal($relativePath: String!) {
      journal(relativePath: $relativePath) {
        id
        couple_names
        subtitle_en
        subtitle_vi
        slug
        featured_image
        hero {
          image
          alt_en
          alt_vi
        }
        wedding_details {
          nationality
          guest_count
          wedding_type_en
          wedding_type_vi
          venue
          wedding_date
        }
        content_blocks {
          ... on JournalContent_blocksText_image_block {
            heading_en
            heading_vi
            content_en
            content_vi
            image
          }
          ... on JournalContent_blocksGallery_block {
            heading_en
            heading_vi
            images {
              image
              alt_en
              alt_vi
            }
          }
          ... on JournalContent_blocksQuote_block {
            quote_en
            quote_vi
            author
          }
        }
      }
    }
  `;

  try {
    const { data } = await client.queries.journal(variables);

    if (!data.journal) {
      notFound();
    }

    return (
      <JournalClient
        data={data}
        variables={variables}
        query={query}
        lang={params.lang}
        slug={params.slug}
      />
    );
  } catch (error) {
    console.error('Error fetching journal:', error);
    notFound();
  }
}
