import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '../../../../tina/__generated__/client';
import ServiceClient from '../../../components/ServiceClient';

interface Props {
  params: { lang: string };
}

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const variables = { relativePath: 'index.mdx' };

  try {
    const { data } = await client.queries.service(variables);
    const seo =
      params.lang === 'vi' ? data.service.seo_vi : data.service.seo_en;

    return {
      title:
        seo?.title ||
        (params.lang === 'vi'
          ? 'Dịch vụ - Meraki Wedding Planner'
          : 'Our Services - Meraki Wedding Planner'),
      description: seo?.description,
    };
  } catch {
    return {
      title:
        params.lang === 'vi'
          ? 'Dịch vụ - Meraki Wedding Planner'
          : 'Our Services - Meraki Wedding Planner',
    };
  }
}

export default async function ServicePage({ params }: Props) {
  if (!['en', 'vi'].includes(params.lang)) {
    notFound();
  }

  const variables = { relativePath: 'index.mdx' };

  try {
    const result = await client.queries.service(variables);

    return (
      <ServiceClient
        data={result.data}
        query={result.query}
        variables={variables}
        lang={params.lang}
      />
    );
  } catch {
    notFound();
  }
}
