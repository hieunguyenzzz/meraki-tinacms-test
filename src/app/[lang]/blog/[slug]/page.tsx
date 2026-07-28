/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../../tina/__generated__/client';
import BlogClient from '../../../../components/BlogClient';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
  params: { lang: string; slug: string };
}

type BlogLanguage = 'en' | 'vi';
type BlogSlugEntry = {
  relativePath: string;
  slugEn: string;
  slugVi: string;
};
type BlogSlugNode = {
  _sys?: {
    relativePath: string;
    filename: string;
  } | null;
  slug?: string | null;
  slug_vi?: string | null;
};

// Enable static generation with revalidation
export const revalidate = 3600;

const toBlogSlugEntry = (
  node: BlogSlugNode | null | undefined
): BlogSlugEntry | null => {
  const relativePath = node?._sys?.relativePath;
  const fallbackSlug = node?._sys?.filename?.replace(/\.mdx$/, '').trim();
  const slugEn = node?.slug?.trim() || fallbackSlug;

  if (!relativePath || !slugEn) {
    return null;
  }

  return {
    relativePath,
    slugEn,
    slugVi: node?.slug_vi?.trim() || slugEn,
  };
};

const getBlogSlugEntries = async () => {
  const blogList = await client.queries.blogConnection();

  return (blogList.data.blogConnection.edges || [])
    .map((edge) => toBlogSlugEntry(edge?.node))
    .filter((entry): entry is BlogSlugEntry => entry !== null);
};

const findBlogBySlug = async (
  slug: string,
  field: 'slug' | 'slug_vi'
): Promise<BlogSlugEntry | null> => {
  const result = await client.queries.blogConnection({
    filter:
      field === 'slug_vi'
        ? { slug_vi: { eq: slug } }
        : { slug: { eq: slug } },
    first: 1,
  });

  return toBlogSlugEntry(result.data.blogConnection.edges?.[0]?.node);
};

const resolveBlog = async (slug: string, lang: BlogLanguage) => {
  const localeField = lang === 'vi' ? 'slug_vi' : 'slug';
  const alternateField = lang === 'vi' ? 'slug' : 'slug_vi';

  return (
    (await findBlogBySlug(slug, localeField)) ||
    (await findBlogBySlug(slug, alternateField))
  );
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;

  if (lang !== 'en' && lang !== 'vi') {
    return {};
  }

  try {
    const resolvedBlog = await resolveBlog(slug, lang);
    if (!resolvedBlog) {
      throw new Error(`No blog found for slug "${slug}"`);
    }

    const blogPost = await client.queries.blog({
      relativePath: resolvedBlog.relativePath,
    });

    const post = blogPost.data.blog;
    const title = lang === 'en' ? post.title_en : post.title_vi;
    const description = lang === 'en' ? post.excerpt_en : post.excerpt_vi;
    const seo = lang === 'en' ? post.seo_en : post.seo_vi;

    return {
      title: seo?.title || `${title} - Meraki Wedding Planner`,
      description: seo?.description || description || '',
      alternates: {
        canonical: `/${lang}/blog/${
          lang === 'vi' ? resolvedBlog.slugVi : resolvedBlog.slugEn
        }`,
        languages: {
          en: `/en/blog/${resolvedBlog.slugEn}`,
          vi: `/vi/blog/${resolvedBlog.slugVi}`,
        },
      },
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
    const entries = await getBlogSlugEntries();

    return entries.flatMap(({ slugEn, slugVi }) => [
      { lang: 'en', slug: slugEn },
      { lang: 'vi', slug: slugVi },
    ]);
  } catch {
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = params;

  if (!['en', 'vi'].includes(lang)) {
    notFound();
  }

  let resolvedBlog: BlogSlugEntry | null;
  try {
    resolvedBlog = await resolveBlog(slug, lang as BlogLanguage);
  } catch (error) {
    console.error('Error resolving blog slug:', error);
    notFound();
  }

  if (!resolvedBlog) {
    notFound();
  }

  const variables = { relativePath: resolvedBlog.relativePath };
  let result: Awaited<ReturnType<typeof client.queries.blog>>;

  try {
    result = await client.queries.blog(variables);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  if (!result.data.blog.published) {
    notFound();
  }

  return (
    <BlogClient
      data={result.data}
      query={result.query}
      variables={variables}
      lang={lang}
      localizedSlugs={{
        en: resolvedBlog.slugEn,
        vi: resolvedBlog.slugVi,
      }}
    />
  );
}
