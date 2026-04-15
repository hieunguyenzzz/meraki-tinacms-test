'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTina, tinaField } from 'tinacms/dist/react';
import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import Pagination from './Pagination';
import MerakiImage from './ui/MerakiImage';
import type { PageQuery } from '../../tina/__generated__/types';

interface BlogNode {
  _sys: { filename: string; createdAt: string };
  slug: string;
  title_en: string;
  title_vi: string;
  excerpt_en?: string;
  excerpt_vi?: string;
  featured_image?: string;
  categories?: string[];
  published_date?: string;
}

interface Props {
  data: PageQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
  blogs: BlogNode[];
}

const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

export default function BlogListingClient({
  data,
  query,
  variables,
  lang,
  blogs,
}: Props) {
  const { data: tinaData } = useTina({ data, query, variables });
  const page = tinaData.page;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Derive unique categories from all blog posts
  const categories = useMemo(() => {
    const all = new Set<string>();
    blogs.forEach((b) => b.categories?.forEach((c) => all.add(c)));
    const allLabel = t({ en: 'All', vi: 'Tất cả' }, lang);
    return [
      { label: allLabel, value: 'All' },
      ...Array.from(all).map((c) => ({ label: c, value: c })),
    ];
  }, [blogs, lang]);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'All') return blogs;
    return blogs.filter((b) => b.categories?.includes(activeCategory));
  }, [activeCategory, blogs]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const getSlug = (blog: BlogNode) =>
    blog.slug || blog._sys.filename.replace('.mdx', '');

  const getTitle = (blog: BlogNode) =>
    lang === 'en' ? blog.title_en : blog.title_vi;

  const getExcerpt = (blog: BlogNode) =>
    lang === 'en' ? blog.excerpt_en : blog.excerpt_vi;

  const formatDate = (blog: BlogNode) => {
    const raw = blog.published_date || blog._sys.createdAt;
    return new Date(raw).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN');
  };

  return (
    <div className='bg-background-base'>
      <Header lang={lang} />

      {/* Hero Section */}
      <section className='relative'>
        <div className='grid sm:grid-cols-1 lg:grid-cols-2 items-stretch'>
          {/* Left - Hero Image */}
          {page.hero?.background_image ? (
            <div
              className='md:h-[500px] relative lg:h-full overflow-hidden'
              data-tina-field={tinaField(page.hero, 'background_image')}>
              <MerakiImage
                src={page.hero.background_image}
                alt='Blog Hero'
                fill
                className='object-cover object-center'
                priority
              />
            </div>
          ) : (
            <div className='md:h-[500px] bg-background-2 lg:h-full' />
          )}

          {/* Right - Hero Content */}
          <div className='md:w-[540px] mx-auto md:-translate-y-20 lg:translate-y-0 lg:w-full p-20 flex flex-col gap-10 justify-center bg-background-1 items-center text-center'>
            <h1
              className='text-display font-vocago uppercase tracking-wider'
              data-tina-field={tinaField(
                page,
                lang === 'en' ? 'title_en' : 'title_vi',
              )}>
              {lang === 'en' ? page.title_en : page.title_vi}
            </h1>

            <p
              className='text-body-md text-text-secondary max-w-[500px] leading-relaxed'
              data-tina-field={tinaField(
                page.hero,
                lang === 'en' ? 'description_en' : 'description_vi',
              )}>
              {lang === 'en'
                ? page.hero?.description_en
                : page.hero?.description_vi}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className='md:py-0 lg:pt-20 lg:pb-10'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex gap-6 overflow-x-auto justify-center'>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`text-body-sm px-4 py-2 whitespace-nowrap transition-colors ${
                    activeCategory === cat.value
                      ? 'text-text-primary bg-background-2'
                      : 'text-text-secondary hover:bg-background-1 border-b-[1px] border-text-primary'
                  }`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid */}
      <section className='pb-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20'>
          {paginatedBlogs.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
              {paginatedBlogs.map((blog, index) => {
                const shouldTranslate = index % 3 === 1;
                const slug = getSlug(blog);
                const title = getTitle(blog);
                const excerpt = getExcerpt(blog);

                return (
                  <div
                    key={slug}
                    className={`group ${shouldTranslate ? 'lg:-translate-y-16' : ''}`}>
                    <Link href={`/${lang}/blog/${slug}`}>
                      {/* Image */}
                      <div className='relative aspect-[3/4] overflow-hidden mb-6'>
                        {blog.featured_image ? (
                          <MerakiImage
                            src={blog.featured_image}
                            alt={title}
                            fill
                            className='object-cover group-hover:scale-105 transition-transform duration-500'
                          />
                        ) : (
                          <div className='w-full h-full bg-background-2' />
                        )}
                      </div>

                      {/* Content */}
                      <div className='text-center space-y-2'>
                        {blog.categories && blog.categories.length > 0 && (
                          <p className='text-body-sm text-text-secondary uppercase tracking-wider'>
                            {blog.categories[0]}
                          </p>
                        )}
                        <h2 className='text-h4 font-vocago tracking-wide'>
                          {title}
                        </h2>
                        {excerpt && (
                          <p className='text-body-sm text-text-secondary line-clamp-2'>
                            {excerpt}
                          </p>
                        )}
                        <p className='text-body-sm text-text-secondary'>
                          {formatDate(blog)}
                        </p>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-16'>
              <p className='text-body-md text-text-secondary'>
                {activeCategory === 'All'
                  ? t(
                      {
                        en: 'No blog posts available yet. Check back soon!',
                        vi: 'Chưa có bài viết nào. Hãy quay lại sau!',
                      },
                      lang,
                    )
                  : t(
                      {
                        en: `No blog posts found for "${activeCategory}".`,
                        vi: `Không tìm thấy bài viết nào cho "${activeCategory}".`,
                      },
                      lang,
                    )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Let's Connect Section */}
      {page.lets_connect && (
        <section className='py-10 bg-background-1'>
          <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
            <div className='flex items-center justify-center'>
              <MerakiImage
                src='/images/botanical/2.svg'
                alt='Decorative botanical element'
                className='w-[48px] h-auto'
                width={48}
              />
            </div>

            <h2
              className='text-h2 font-vocago'
              data-tina-field={tinaField(
                page.lets_connect,
                lang === 'en' ? 'title_en' : 'title_vi',
              )}>
              {lang === 'en'
                ? page.lets_connect.title_en
                : page.lets_connect.title_vi}
            </h2>

            <p
              className='text-body-md text-text-secondary max-w-xl mx-auto'
              data-tina-field={tinaField(
                page.lets_connect,
                lang === 'en' ? 'description_en' : 'description_vi',
              )}>
              {lang === 'en'
                ? page.lets_connect.description_en
                : page.lets_connect.description_vi}
            </p>

            <a
              href={`/${lang}${page.lets_connect.button_link || '/lets-connect'}`}
              className='inline-block text-body-md text-text-primary hover:text-text-accent transition-colors border-b border-text-primary hover:border-text-accent'
              data-tina-field={tinaField(
                page.lets_connect,
                lang === 'en' ? 'button_text_en' : 'button_text_vi',
              )}>
              {lang === 'en'
                ? page.lets_connect.button_text_en
                : page.lets_connect.button_text_vi}
            </a>
          </div>
        </section>
      )}

      <Footer lang={lang} />
    </div>
  );
}
