import type { Metadata } from 'next';
import { client } from '../../../../tina/__generated__/client';
import AboutClient from '../../../components/AboutClient';
import { localeAlternates } from '../../../lib/alternates';
import { assertLocale } from '../../../lib/locale';

interface Props {
  params: { lang: string };
}

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;
  const alternates = localeAlternates(lang, '/about');

  try {
    const response = await client.queries.about({ relativePath: 'index.mdx' });
    const seo =
      lang === 'en' ? response.data.about.seo_en : response.data.about.seo_vi;

    return {
      title: seo?.title || 'About Meraki Wedding Planner',
      description: seo?.description || '',
      alternates,
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
      alternates,
    };
  }
}

export default async function AboutPage({ params }: Props) {
  const { lang } = params;

  assertLocale(lang);

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
