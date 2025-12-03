import { client } from '../../../../../tina/__generated__/client';
import JournalClient from '../../../../components/JournalClient';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    lang: string;
    slug: string;
  };
}

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour (ISR)

export async function generateStaticParams() {
  try {
    const journalList = await client.queries.journalConnection();
    const slugs: Array<{ lang: string; slug: string }> = [];

    journalList.data.journalConnection.edges?.forEach((edge) => {
      if (edge?.node?.slug) {
        const slug = edge.node.slug;
        slugs.push({ lang: 'en', slug }, { lang: 'vi', slug });
      }
    });

    return slugs;
  } catch (error) {
    console.error('Error generating static params for journals:', error);
    return [];
  }
}

export async function generateMetadata({ params }: PageProps) {
  try {
    const { data } = await client.queries.journal({
      relativePath: `${params.slug}.mdx`,
    });

    const title = data.journal.couple_names || 'Journal Entry';
    const subtitle = params.lang === 'vi'
      ? data.journal.template_layout?.main_headline_vi
      : data.journal.template_layout?.main_headline_en;

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

  try {
    const result = await client.queries.journal(variables);

    return (
      <JournalClient
        data={result.data}
        variables={variables}
        query={result.query}  // Use the auto-generated query
        lang={params.lang}
        slug={params.slug}
      />
    );
  } catch (error) {
    console.error('Error fetching journal:', error);
    notFound();
  }
}
