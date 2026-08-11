import { client } from '../../../../../tina/__generated__/client';
import JournalClient from '../../../../components/JournalClient';
import JsonLd from '../../../../components/JsonLd';
import { localeAlternates } from '../../../../lib/alternates';
import { displayHeadline } from '../../../../lib/headlineCase';
import { getThumborUrl } from '../../../../lib/image';
import { buildDetailBreadcrumbSchema } from '../../../../lib/schema/breadcrumbList';
import { absoluteUrl } from '../../../../lib/schema/siteUrl';
import { buildWebPageSchema } from '../../../../lib/schema/webPage';
import { richTextToPlainText, truncate } from '../../../../lib/richText';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { assertLocale } from '../../../../lib/locale';

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

// Thumbor serves WebP by default, which Facebook/Messenger won't render in a
// link preview — force JPEG for the share image only.
const OG_IMAGE_SIZE = '1174x1760/filters:format(jpeg)';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { data } = await client.queries.journal({
      relativePath: `${params.slug}.mdx`,
    });

    const journal = data.journal;
    const isVi = params.lang === 'vi';

    // The album name (headline) is the share title, not the couple names.
    // Most are stored in caps for the hero, which already uppercases in CSS —
    // see lib/headlineCase.ts.
    const headline = displayHeadline(
      isVi
        ? journal.template_layout?.main_headline_vi
        : journal.template_layout?.main_headline_en
    );
    const name = headline || journal.couple_names || 'Journal Entry';
    // Journal detail was the only template emitting a bare page title; blog
    // detail has always carried the brand.
    const title = `${name} - Meraki Wedding Planner`;

    // Description comes from the first story block ("What we loved"), which
    // journals author as either a text block or a text + image block.
    const STORY_BLOCKS = [
      'JournalContent_blocksTextBlock',
      'JournalContent_blocksTextImageBlock',
    ];
    const storyBlock = journal.content_blocks?.find(
      (block) => block && STORY_BLOCKS.includes(block.__typename)
    ) as { description_en?: unknown; description_vi?: unknown } | undefined;
    const story = richTextToPlainText(
      isVi ? storyBlock?.description_vi : storyBlock?.description_en
    );
    const description = story
      ? truncate(story, 300)
      : 'A beautiful wedding story';

    const image = journal.featured_image
      ? getThumborUrl(OG_IMAGE_SIZE, journal.featured_image)
      : undefined;

    return {
      title,
      description,
      // The journal route resolves by filename, so both locales share the slug.
      alternates: localeAlternates(params.lang, `/journal/${params.slug}`),
      openGraph: {
        title,
        description,
        type: 'article',
        siteName: 'Meraki Wedding Planner',
        locale: isVi ? 'vi_VN' : 'en_US',
        images: image ? [image] : undefined,
      },
      twitter: {
        card: image ? 'summary_large_image' : 'summary',
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      title: 'Journal Entry Not Found',
    };
  }
}

export default async function JournalPage({ params }: PageProps) {
  assertLocale(params.lang);

  const variables = { relativePath: `${params.slug}.mdx` };

  try {
    const result = await client.queries.journal(variables);
    const journal = result.data.journal;
    const isVi = params.lang === 'vi';

    // Same title the share metadata uses: the album headline, not the names.
    const headline = displayHeadline(
      isVi
        ? journal.template_layout?.main_headline_vi
        : journal.template_layout?.main_headline_en
    );
    const name = headline || journal.couple_names || '';
    const journalUrl = absoluteUrl(`/${params.lang}/journal/${params.slug}`);

    return (
      <>
        <JsonLd
          data={[
            buildWebPageSchema({
              lang: params.lang,
              url: journalUrl,
              name,
            }),
            buildDetailBreadcrumbSchema({
              lang: params.lang,
              section: 'journal',
              pageName: name,
              pageSlug: params.slug,
            }),
          ]}
        />
        <JournalClient
          data={result.data}
          variables={variables}
          query={result.query}  // Use the auto-generated query
          lang={params.lang}
          slug={params.slug}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching journal:', error);
    notFound();
  }
}
