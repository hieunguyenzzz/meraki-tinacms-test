import { client } from "../../../tina/__generated__/client";
import type { Metadata } from 'next';
import HomeClient from '../../components/HomeClient';

interface Props {
  params: { lang: string };
}

// Default content
const defaultContent = {
  title: 'Meraki Wedding Planner',
  description: {
    en: 'Professional wedding planning services in Vietnam',
    vi: 'Dịch vụ tổ chức tiệc cưới chuyên nghiệp tại Việt Nam',
  },
  hero: {
    subtitle: {
      en: 'Creating unforgettable moments with love and passion',
      vi: 'Tạo nên những khoảnh khắc khó quên với tình yêu và đam mê',
    },
  },
};

// Helper function to get localized text
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every hour (ISR)

// Pre-generate both language versions
export function generateStaticParams() {
  return [
    { lang: 'en' },
    { lang: 'vi' },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = params;

  try {
    const pageData = await client.queries.page({ relativePath: 'index.mdx' });
    const page = pageData.data.page;
    const seo = lang === 'en' ? page?.seo_en : page?.seo_vi;

    return {
      title: seo?.title || defaultContent.title,
      description: seo?.description || t(defaultContent.description, lang),
      openGraph: {
        title: seo?.title || defaultContent.title,
        description: seo?.description || t(defaultContent.description, lang),
        type: 'website',
      },
      robots: 'index, follow',
    };
  } catch (error) {
    return {
      title: defaultContent.title,
      description: t(defaultContent.description, lang),
    };
  }
}

export default async function LangHomePage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  const variables = { relativePath: 'index.mdx' };
  const query = `
    query Page($relativePath: String!) {
      page(relativePath: $relativePath) {
        id
        title_en
        title_vi
        hero {
          title_en
          title_vi
          subtitle_en
          subtitle_vi
          background_image
        }
        services_section {
          title_en
          title_vi
          description_en
          description_vi
        }
        seo_en {
          title
          description
        }
        seo_vi {
          title
          description
        }
      }
    }
  `;

  try {
    const data = await client.queries.page(variables);

    return (
      <HomeClient data={data} variables={variables} query={query} lang={lang} />
    );
  } catch (error) {
    console.error('Error fetching page data:', error);
    // Return a basic version if there's an error
    return (
      <HomeClient
        data={{ page: null }}
        variables={variables}
        query={query}
        lang={lang}
      />
    );
  }
}
