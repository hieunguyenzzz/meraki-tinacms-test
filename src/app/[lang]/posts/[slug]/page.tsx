/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../../tina/__generated__/client';
import BlogClient from '../../../../components/BlogClient';
import JsonLd from '../../../../components/JsonLd';
import { buildArticleSchema } from '../../../../lib/schema/article';
import { buildDetailBreadcrumbSchema } from '../../../../lib/schema/breadcrumbList';
import { absoluteUrl } from '../../../../lib/schema/siteUrl';
import { buildWebPageSchema } from '../../../../lib/schema/webPage';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getShareImage,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '../../../../lib/shareImage';

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

    const metaTitle = seo?.title || `${title} - Meraki Wedding Planner`;
    const metaDescription = seo?.description || description || '';
    // Each post shares its own featured image, cropped to the share ratio.
    const shareImage = getShareImage(post.featured_image);

    return {
      title: metaTitle,
      description: metaDescription,
      alternates: {
        canonical: `/${lang}/posts/${
          lang === 'vi' ? resolvedBlog.slugVi : resolvedBlog.slugEn
        }`,
        languages: {
          en: `/en/posts/${resolvedBlog.slugEn}`,
          vi: `/vi/posts/${resolvedBlog.slugVi}`,
        },
      },
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'article',
        siteName: 'Meraki Wedding Planner',
        locale: lang === 'en' ? 'en_US' : 'vi_VN',
        images: [
          {
            url: shareImage,
            width: SHARE_IMAGE_WIDTH,
            height: SHARE_IMAGE_HEIGHT,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle,
        description: metaDescription,
        images: [shareImage],
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

  const post = result.data.blog;
  const isVi = lang === 'vi';
  const canonicalSlug = isVi ? resolvedBlog.slugVi : resolvedBlog.slugEn;
  const title = (isVi ? post.title_vi : post.title_en) || '';
  const excerpt = isVi ? post.excerpt_vi : post.excerpt_en;
  const seo = isVi ? post.seo_vi : post.seo_en;
  const postUrl = absoluteUrl(`/${lang}/posts/${canonicalSlug}`);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            lang,
            url: postUrl,
            name: seo?.title || title,
            description: seo?.description || excerpt,
          }),
          buildArticleSchema({
            lang,
            url: postUrl,
            headline: title,
            description: seo?.description || excerpt,
            image: post.featured_image,
            datePublished: post.published_date,
            categories: post.categories,
            tags: post.tags,
          }),
          buildDetailBreadcrumbSchema({
            lang,
            section: 'blog',
            detailSegment: 'posts',
            pageName: title,
            pageSlug: canonicalSlug,
          }),
        ]}
      />
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
    </>
  );
}
