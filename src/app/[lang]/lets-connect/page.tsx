import type { Metadata } from 'next';
import { client } from '../../../../tina/__generated__/client';
import LetsConnectClient from '../../../components/LetsConnectClient';

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
    const response = await client.queries.letsConnect({
      relativePath: 'index.mdx',
    });
    const seo =
      lang === 'en'
        ? response.data.letsConnect.seo_en
        : response.data.letsConnect.seo_vi;

    return {
      title: seo?.title || "Let's Connect - Meraki Wedding Planner",
      description: seo?.description || '',
    };
  } catch {
    return {
      title:
        lang === 'en'
          ? "Let's Connect - Meraki Wedding Planner"
          : 'Kết nối - Meraki Wedding Planner',
      description:
        lang === 'en'
          ? 'Tell Meraki about your wedding and begin planning a meaningful celebration.'
          : 'Chia sẻ câu chuyện đám cưới của bạn và bắt đầu hành trình planning cùng Meraki.',
    };
  }
}

export default async function LetsConnectPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const relativePath = 'index.mdx';
  const response = await client.queries.letsConnect({ relativePath });

  return (
    <LetsConnectClient
      data={response.data}
      query={response.query}
      variables={{ relativePath }}
      lang={lang}
    />
  );
}
