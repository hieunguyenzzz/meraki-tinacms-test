import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { client } from '../../../../tina/__generated__/client';
import JsonLd from '../../../components/JsonLd';
import ServiceClient from '../../../components/ServiceClient';
import { localeAlternates } from '../../../lib/alternates';
import { buildServiceSchema } from '../../../lib/schema/service';
import { absoluteUrl } from '../../../lib/schema/siteUrl';
import { buildWebPageSchema } from '../../../lib/schema/webPage';

interface Props {
  params: { lang: string };
}

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'vi' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const variables = { relativePath: 'index.mdx' };
  const alternates = localeAlternates(params.lang, '/service');

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
      alternates,
    };
  } catch {
    return {
      title:
        params.lang === 'vi'
          ? 'Dịch vụ - Meraki Wedding Planner'
          : 'Our Services - Meraki Wedding Planner',
      alternates,
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
    const service = result.data.service;
    const isVi = params.lang === 'vi';
    const seo = isVi ? service.seo_vi : service.seo_en;
    const pageUrl = absoluteUrl(`/${params.lang}/service`);

    const offerings = (
      [
        ['city', service.wedding_types?.city],
        ['destination', service.wedding_types?.destination],
      ] as const
    ).filter(([, type]) => Boolean(type?.title_en));

    return (
      <>
        <JsonLd
          data={[
            buildWebPageSchema({
              lang: params.lang,
              url: pageUrl,
              name:
                seo?.title ||
                (isVi ? service.hero?.title_vi : service.hero?.title_en) ||
                '',
              description: seo?.description,
            }),
            ...offerings.map(([key, type]) =>
              buildServiceSchema({
                lang: params.lang,
                key,
                name: (isVi ? type?.title_vi : type?.title_en) || '',
                description: isVi ? type?.description_vi : type?.description_en,
                url: pageUrl,
                image: type?.background_image,
              })
            ),
          ]}
        />
        <ServiceClient
          data={result.data}
          query={result.query}
          variables={variables}
          lang={params.lang}
        />
      </>
    );
  } catch {
    notFound();
  }
}
