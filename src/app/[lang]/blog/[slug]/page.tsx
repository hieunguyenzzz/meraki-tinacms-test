/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../../tina/__generated__/client';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Header from '../../../../components/Header';
import Footer from '../../../../components/Footer';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { lang: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = params;
  
  try {
    const blogPost = await client.queries.blog({
      relativePath: `${slug}.mdx`,
    });
    
    const post = blogPost.data.blog;
    const title = post.title;
    const description = post.excerpt;
    
    return {
      title: title,
      description: description,
    };
  } catch (error) {
    console.error('Error fetching blog post for metadata:', error);
    return {
      title: lang === 'en' ? 'Blog Post - Meraki Wedding Planner' : 'Bài viết - Meraki Wedding Planner',
      description: lang === 'en' ? 'Wedding planning insights and tips' : 'Cái nhìn sâu sắc và mẹo lập kế hoạch đám cưới',
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
        slugs.push(
          { lang: 'en', slug },
          { lang: 'vi', slug }
        );
      }
    });
    
    return slugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { lang, slug } = params;

  if (!['en', 'vi'].includes(lang)) {
    notFound();
  }

  let blogPost: any;
  try {
    const result = await client.queries.blog({
      relativePath: `${slug}.mdx`,
    });
    blogPost = result.data.blog;
    
    if (!blogPost.published) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching blog post:', error);
    notFound();
  }

  const title = blogPost.title;
  const publishedDate = new Date(blogPost.published_date).toLocaleDateString(
    lang === 'en' ? 'en-US' : 'vi-VN',
    { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
  );

  // Helper function to get localized text
  const t = (text: { en: string; vi: string }) => 
    lang === 'en' ? text.en : text.vi;

  return (
    <div className="min-h-screen bg-white">
      <Header lang={lang} />

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href={`/${lang}`} className="text-gray-500 hover:text-gray-700">
                  {t({ en: 'Home', vi: 'Trang chủ' })}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="text-gray-500 hover:text-gray-700">
                  {t({ en: 'Blog', vi: 'Blog' })}
                </Link>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-900 truncate">
                {title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <div className="mb-4">
              {blogPost.categories && blogPost.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blogPost.categories.map((category: string, index: number) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
              {title}
            </h1>
            
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <time dateTime={blogPost.published_date}>
                {publishedDate}
              </time>
              <span className="mx-2">•</span>
              <span>{t({ en: 'Wedding Planning Tips', vi: 'Mẹo lập kế hoạch cưới' })}</span>
            </div>

            {blogPost.featured_image && (
              <div className="mb-8">
                <img 
                  src={blogPost.featured_image} 
                  alt={title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
                />
              </div>
            )}
          </header>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <TinaMarkdown content={blogPost.body} />
          </div>

          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                {t({ en: 'Tags', vi: 'Thẻ' })}
              </h3>
              <div className="flex flex-wrap gap-2">
                {blogPost.tags.map((tag: string, index: number) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t({ en: 'Found this helpful?', vi: 'Thấy hữu ích?' })}
                </h3>
                <p className="text-gray-600">
                  {t({ 
                    en: 'Share it with couples who might benefit from these tips.',
                    vi: 'Chia sẻ với các cặp đôi có thể được hưởng lợi từ những mẹo này.'
                  })}
                </p>
              </div>
              <div className="flex space-x-4">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 p-8 bg-gray-50 rounded-lg text-center">
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              {t({ 
                en: 'Need Help Planning Your Wedding?',
                vi: 'Cần trợ giúp lập kế hoạch đám cưới?' 
              })}
            </h3>
            <p className="text-gray-600 mb-6">
              {t({ 
                en: 'Our experienced wedding planners are here to help you create the perfect celebration.',
                vi: 'Các nhà tổ chức đám cưới có kinh nghiệm của chúng tôi sẵn sàng giúp bạn tạo ra lễ kỷ niệm hoàn hảo.'
              })}
            </p>
            <div className="space-x-4">
              <Link
                href={`/${lang}/lets-connect`}
                className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                {t({ en: 'Get in Touch', vi: 'Liên hệ' })}
              </Link>
              <Link
                href={`/${lang}/service`}
                className="inline-block border border-gray-900 text-gray-900 px-6 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors"
              >
                {t({ en: 'Our Services', vi: 'Dịch vụ của chúng tôi' })}
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
            {t({ en: 'Related Articles', vi: 'Bài viết liên quan' })}
          </h2>
          
          <div className="text-center">
            <Link
              href={`/${lang}/blog`}
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              {t({ en: 'View All Articles', vi: 'Xem tất cả bài viết' })}
            </Link>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
