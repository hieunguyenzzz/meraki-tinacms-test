/* eslint-disable @typescript-eslint/no-explicit-any */
import { client } from '../../../../tina/__generated__/client';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: { lang: string };
}

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

  return {
    title: lang === 'en' ? 'Blog - Meraki Wedding Planner' : 'Blog - Meraki Wedding Planner',
    description: lang === 'en'
      ? 'Wedding tips, inspiration, and behind-the-scenes stories from Meraki Wedding Planner'
      : 'Mẹo cưới, cảm hứng và những câu chuyện hậu trường từ Meraki Wedding Planner',
  };
}

export default async function BlogPage({ params }: Props) {
  const { lang } = params;

  if (!['en', 'vi'].includes(lang)) {
    return <div>Not Found</div>;
  }

  let blogs: any[] = [];
  try {
    const blogList = await client.queries.blogConnection({
      filter: {
        published: {
          eq: true
        }
      }
    });
    // Filter out null values and ensure we have valid nodes
    blogs = (blogList.data.blogConnection.edges || [])
      .filter((edge): edge is NonNullable<typeof edge> => edge?.node != null)
      .map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // blogs will remain empty array
  }

  return (
    <div className='min-h-screen bg-white'>
      <Header lang={lang} />

      {/* Hero Section */}
      <section className='py-16 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h1 className='text-4xl md:text-5xl font-light text-gray-900 mb-6'>
            {lang === 'en' ? 'Wedding Blog' : 'Blog Cưới'}
          </h1>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
            {lang === 'en'
              ? 'Tips, inspiration, and stories to help you plan your perfect wedding'
              : 'Mẹo, cảm hứng và câu chuyện giúp bạn lên kế hoạch cho đám cưới hoàn hảo'}
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {blogs.length > 0 ? (
            <>
              {/* Featured Post */}
              {blogs.length > 0 && (
                <div className='mb-16'>
                  <h2 className='text-2xl font-light text-gray-900 mb-6'>
                    {lang === 'en' ? 'Featured Article' : 'Bài viết nổi bật'}
                  </h2>
                  <article className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                    <div className='md:flex'>
                      {blogs[0].featured_image && (
                        <div className='md:w-1/2'>
                          <img
                            src={blogs[0].featured_image}
                            alt={blogs[0].title}
                            className='w-full h-64 md:h-full object-cover'
                            loading='lazy'
                          />
                        </div>
                      )}
                      <div
                        className={`p-8 ${
                          blogs[0].featured_image ? 'md:w-1/2' : 'w-full'
                        }`}>
                        {blogs[0].categories &&
                          blogs[0].categories.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-4'>
                              {blogs[0].categories
                                .slice(0, 3)
                                .map((category: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className='px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full'>
                                    {category}
                                  </span>
                                ))}
                            </div>
                          )}
                        <h3 className='text-2xl md:text-3xl font-light text-gray-900 mb-4'>
                          {blogs[0].title}
                        </h3>
                        <p className='text-gray-600 mb-6 text-lg'>
                          {blogs[0].excerpt}
                        </p>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-gray-500'>
                            {blogs[0].published_date
                              ? new Date(
                                  blogs[0].published_date
                                ).toLocaleDateString(
                                  lang === 'en' ? 'en-US' : 'vi-VN'
                                )
                              : new Date(
                                  blogs[0]._sys.createdAt
                                ).toLocaleDateString(
                                  lang === 'en' ? 'en-US' : 'vi-VN'
                                )}
                          </span>
                          <Link
                            href={`/${lang}/blog/${
                              blogs[0].slug ||
                              blogs[0]._sys.filename.replace('.mdx', '')
                            }`}
                            className='bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors'>
                            {lang === 'en' ? 'Read Article' : 'Đọc bài viết'}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                </div>
              )}

              {/* All Posts Grid */}
              {blogs.length > 1 && (
                <>
                  <h2 className='text-2xl font-light text-gray-900 mb-8'>
                    {lang === 'en' ? 'All Articles' : 'Tất cả bài viết'}
                  </h2>
                  <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {blogs.slice(1).map((blog, index) => (
                      <article
                        key={index}
                        className='bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow'>
                        {blog.featured_image && (
                          <img
                            src={blog.featured_image}
                            alt={blog.title}
                            className='w-full h-48 object-cover'
                            loading='lazy'
                          />
                        )}
                        <div className='p-6'>
                          {blog.categories && blog.categories.length > 0 && (
                            <div className='flex flex-wrap gap-2 mb-3'>
                              {blog.categories
                                .slice(0, 2)
                                .map((category: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className='px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'>
                                    {category}
                                  </span>
                                ))}
                            </div>
                          )}
                          <h2 className='text-xl font-medium text-gray-900 mb-3'>
                            {blog.title}
                          </h2>
                          <p className='text-gray-600 mb-4 line-clamp-3'>
                            {blog.excerpt}
                          </p>
                          <div className='flex items-center justify-between'>
                            <span className='text-sm text-gray-500'>
                              {blog.published_date
                                ? new Date(
                                    blog.published_date
                                  ).toLocaleDateString(
                                    lang === 'en' ? 'en-US' : 'vi-VN'
                                  )
                                : new Date(
                                    blog._sys.createdAt
                                  ).toLocaleDateString(
                                    lang === 'en' ? 'en-US' : 'vi-VN'
                                  )}
                            </span>
                            <Link
                              href={`/${lang}/blog/${
                                blog.slug ||
                                blog._sys.filename.replace('.mdx', '')
                              }`}
                              className='text-gray-900 hover:text-gray-600 font-medium text-sm'>
                              {lang === 'en' ? 'Read More' : 'Đọc thêm'} →
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className='text-center py-16'>
              <div className='max-w-md mx-auto'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400 mb-4'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
                  />
                </svg>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  {lang === 'en' ? 'No blog posts yet' : 'Chưa có bài viết nào'}
                </h3>
                <p className='text-gray-500'>
                  {lang === 'en'
                    ? 'Check back soon for wedding tips and inspiration!'
                    : 'Hãy quay lại sớm để xem các mẹo cưới và cảm hứng!'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
