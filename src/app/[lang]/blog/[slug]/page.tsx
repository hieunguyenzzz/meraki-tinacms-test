/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../../tina/__generated__/client';
import BlogClient from '../../../../components/BlogClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { lang: string; slug: string };
}

// Enable static generation with revalidation
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;

  try {
    const blogPost = await client.queries.blog({
      relativePath: `${slug}.mdx`,
    });

    const post = blogPost.data.blog;
    const title = lang === 'en' ? post.title_en : post.title_vi;
    const description = lang === 'en' ? post.excerpt_en : post.excerpt_vi;
    const seo = lang === 'en' ? post.seo_en : post.seo_vi;

    return {
      title: seo?.title || `${title} - Meraki Wedding Planner`,
      description: seo?.description || description || '',
    };
  } catch {
    return {
      title:
        lang === 'en'
          ? 'Blog Post - Meraki Wedding Planner'
          : 'Bài viết - Meraki Wedding Planner',
    };
  }
}

export async function generateStaticParams() {
  try {
    const blogList = await client.queries.blogConnection();
    const slugs: Array<{ lang: string; slug: string }> = [];

    blogList.data.blogConnection.edges?.forEach((edge) => {
      if (edge?.node?._sys.filename) {
        const slug = edge.node._sys.filename.replace('.mdx', '');
        slugs.push({ lang: 'en', slug }, { lang: 'vi', slug });
      }
    });

    return slugs;
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = params;

  if (!['en', 'vi'].includes(lang)) {
    notFound();
  }

  const variables = { relativePath: `${slug}.mdx` };

  try {
    const result = await client.queries.blog(variables);

    if (!result.data.blog.published) {
      notFound();
    }

    return (
      <BlogClient
        data={result.data}
        query={result.query}
        variables={variables}
        lang={lang}
      />
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }
}
