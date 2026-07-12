import type { Metadata } from 'next';
import { client } from '../../../../tina/__generated__/client';
import AboutClient from '../../../components/AboutClient';

interface Props {
  params: { lang: string };
}

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;

  try {
    const response = await client.queries.about({ relativePath: 'index.mdx' });
    const seo =
      lang === 'en' ? response.data.about.seo_en : response.data.about.seo_vi;

    return {
      title: seo?.title || 'About Meraki Wedding Planner',
      description: seo?.description || '',
    };
  } catch {
    return {
      title:
        lang === 'en'
          ? 'About Meraki Wedding Planner'
          : 'Về Meraki Wedding Planner',
      description:
        lang === 'en'
          ? 'Meet the team behind Meraki Wedding Planner.'
          : 'Gặp gỡ đội ngũ Meraki Wedding Planner.',
    };
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const relativePath = 'index.mdx';
  const response = await client.queries.about({ relativePath });

  return (
    <AboutClient
      data={response.data}
      query={response.query}
      variables={{ relativePath }}
      lang={lang}
    />
  );
}
