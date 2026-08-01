'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import type { BlogListingQuery } from '../../tina/__generated__/types';
import {
  LISTING_PAGE_SIZE,
  listingPageUrl,
} from '../lib/listingPagination';
import { useUrlPagination } from '../lib/useUrlPagination';
import Pagination from './Pagination';
import MerakiImage from './ui/MerakiImage';

interface BlogNode {
  id?: string;
  _sys: { filename: string; relativePath?: string; createdAt: string };
  slug: string;
  slug_vi?: string;
  title_en: string;
  title_vi: string;
  excerpt_en?: string;
  excerpt_vi?: string;
  featured_image?: string;
  categories?: string[];
  published_date?: string;
}

interface Props {
  data: BlogListingQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
  blogs: BlogNode[];
  initialPage: number;
}

const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const getBlogId = (blog: BlogNode) =>
  blog.id || blog._sys.relativePath || blog.slug || blog._sys.filename;

export default function BlogListingClient({
  data,
  query,
  variables,
  lang,
  blogs,
  initialPage,
}: Props) {
  const { data: tinaData } = useTina({ data, query, variables });
  const listing = tinaData.blogListing;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const listSectionRef = useRef<HTMLElement | null>(null);
  const previousPageRef = useRef(initialPage);
  const itemsPerPage = LISTING_PAGE_SIZE;

  // Derive unique categories from all blog posts
  const categories = useMemo(() => {
    const configured =
      listing.category_filters
        ?.map((filter) => filter?.value?.trim())
        .filter((value): value is string => Boolean(value)) || [];

    const derived = new Set<string>();
    blogs.forEach((b) => b.categories?.forEach((c) => derived.add(c)));

    const categoryValues =
      configured.length > 0 ? configured : Array.from(derived);

    const allLabel = t({ en: 'All', vi: 'Tất cả' }, lang);

    return [
      { label: allLabel, value: 'All' },
      ...Array.from(new Set(categoryValues)).map((c) => ({
        label: c,
        value: c,
      })),
    ];
  }, [blogs, lang, listing.category_filters]);

  const filteredBlogs = useMemo(() => {
    if (activeCategory === 'All') return blogs;
    return blogs.filter((b) => b.categories?.includes(activeCategory));
  }, [activeCategory, blogs]);

  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const { currentPage, resetPage, setPage } = useUrlPagination(
    totalPages,
    initialPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBlogs = filteredBlogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    if (previousPageRef.current === currentPage) return;
    previousPageRef.current = currentPage;

    requestAnimationFrame(() => {
      const section = listSectionRef.current;
      if (!section) return;

      const headerHeight =
        document.querySelector('header')?.getBoundingClientRect().height || 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, sectionTop - headerHeight),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  }, [currentPage]);

  const getSlug = (blog: BlogNode) => {
    const englishSlug =
      blog.slug?.trim() || blog._sys.filename.replace('.mdx', '');

    return lang === 'vi' ? blog.slug_vi?.trim() || englishSlug : englishSlug;
  };

  const getTitle = (blog: BlogNode) =>
    lang === 'en' ? blog.title_en : blog.title_vi;

  const getExcerpt = (blog: BlogNode) =>
    lang === 'en' ? blog.excerpt_en : blog.excerpt_vi;

  return (
    <div className="bg-background-base">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
          {/* Left - Hero Image */}
          <div
            className="animate__animated animate__fadeInLeft relative aspect-[375/368] overflow-hidden md:h-[500px] md:aspect-auto lg:h-full"
            data-tina-field={tinaField(listing.hero, 'background_image')}
          >
            <MerakiImage
              src={
                listing.hero?.background_image ||
                '/images/journal/listing/hero-image.jpg'
              }
              alt="Blog Hero"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1280px) 50vw, 100vw"
              priority
            />
          </div>

          {/* Right - Hero Content */}
          <div className="bg-paper mx-3 flex -translate-y-20 flex-col items-center justify-between gap-8 bg-background-1 px-4 py-8 text-center md:mx-auto md:w-[540px] md:-translate-y-20 md:gap-20 md:p-20 lg:w-full lg:translate-y-0">
            <h1
              className="text-display font-vocago uppercase tracking-wider"
              data-tina-field={tinaField(
                listing,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {lang === 'en' ? listing.title_en : listing.title_vi}
            </h1>

            {listing.hero?.featured_thumbnail && (
              <div
                className="animate__animated animate__fadeInLeft"
                data-tina-field={tinaField(listing.hero, 'featured_thumbnail')}
              >
                <MerakiImage
                  src={listing.hero.featured_thumbnail}
                  alt="Blog featured thumbnail"
                  className="h-auto w-[140px] object-cover md:w-[260px]"
                  width={260}
                  height={260}
                  sizes="(min-width: 744px) 260px, 140px"
                />
              </div>
            )}

            <p
              className="text-body-md text-text-secondary max-w-[500px] leading-relaxed"
              data-tina-field={tinaField(
                listing.hero,
                lang === 'en' ? 'description_en' : 'description_vi'
              )}
            >
              {lang === 'en'
                ? listing.hero?.description_en
                : listing.hero?.description_vi}
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 md:py-0 lg:pb-10 lg:pt-20">
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="flex justify-start gap-1 overflow-x-auto px-4 [scrollbar-width:none] md:justify-center md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  resetPage();
                }}
                className={`text-body-sm whitespace-nowrap px-3 py-2 transition-colors md:px-4 ${activeCategory === cat.value
                  ? 'text-text-primary bg-background-2'
                  : 'text-text-secondary hover:bg-background-1 border-b-[1px] border-text-primary'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section ref={listSectionRef} className="pb-10">
        <div className="mx-auto mt-8 max-w-7xl px-4 md:mt-20 md:px-6 lg:px-8">
          {paginatedBlogs.length > 0 ? (
            <div
              key={`blog-page-${currentPage}`}
              className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16"
            >
              {paginatedBlogs.map((blog) => {
                const slug = getSlug(blog);
                const title = getTitle(blog);
                const excerpt = getExcerpt(blog);

                return (
                  <div key={getBlogId(blog)} className="group">
                    <Link href={`/${lang}/posts/${slug}`}>
                      {/* Image */}
                      <div className="relative aspect-[3/2] overflow-hidden mb-6">
                        {blog.featured_image ? (
                          <MerakiImage
                            src={blog.featured_image}
                            alt={title}
                            fill
                            sizes="(min-width: 1280px) 592px, (min-width: 744px) calc(50vw - 40px), calc(100vw - 32px)"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-background-2" />
                        )}
                      </div>

                      {/* Category tag */}
                      {blog.categories && blog.categories.length > 0 && (
                        <div className="mb-4">
                          <span className="text-body-sm text-text-primary border-b border-t border-text-primary pb-1">
                            {blog.categories[0]}
                          </span>
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-h2 font-vocago uppercase tracking-wide mb-4 leading-tight">
                        {title}
                      </h2>

                      {/* Author + Date */}
                      {/* <div className="flex items-center justify-between text-body-sm text-text-secondary uppercase tracking-wider mb-4">
                        <span>{authorLabel}</span>
                        <time dateTime={getDateIso(blog)}>
                          {formatDate(blog)}
                        </time>
                      </div> */}

                      {/* Excerpt */}
                      {excerpt && (
                        <p className="text-body-sm text-text-secondary line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-body-md text-text-secondary">
                {activeCategory === 'All'
                  ? t(
                    {
                      en: 'No blog posts available yet. Check back soon!',
                      vi: 'Chưa có bài viết nào. Hãy quay lại sau!',
                    },
                    lang
                  )
                  : t(
                    {
                      en: `No blog posts found for "${activeCategory}".`,
                      vi: `Không tìm thấy bài viết nào cho "${activeCategory}".`,
                    },
                    lang
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
        onPageChange={setPage}
        buildHref={(page) => listingPageUrl(`/${lang}/blog`, page)}
      />

      {/* Let's Connect Section */}
      {listing.lets_connect && (
        <section className="py-10 bg-background-1">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-6">
            <div className="flex items-center justify-center">
              <MerakiImage
                src="/images/botanical/2.svg"
                alt="Decorative botanical element"
                className="w-[48px] h-auto"
                width={48}
                height={48}
              />
            </div>

            <h2
              className="text-h2 font-vocago"
              data-tina-field={tinaField(
                listing.lets_connect,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {lang === 'en'
                ? listing.lets_connect.title_en
                : listing.lets_connect.title_vi}
            </h2>

            <p
              className="text-body-md text-text-secondary max-w-xl mx-auto"
              data-tina-field={tinaField(
                listing.lets_connect,
                lang === 'en' ? 'description_en' : 'description_vi'
              )}
            >
              {lang === 'en'
                ? listing.lets_connect.description_en
                : listing.lets_connect.description_vi}
            </p>

            <a
              href={`/${lang}${listing.lets_connect.button_link || '/lets-connect'
                }`}
              className="inline-block text-body-md text-text-primary hover:text-text-accent transition-colors border-b border-text-primary hover:border-text-accent"
              data-tina-field={tinaField(
                listing.lets_connect,
                lang === 'en' ? 'button_text_en' : 'button_text_vi'
              )}
            >
              {lang === 'en'
                ? listing.lets_connect.button_text_en
                : listing.lets_connect.button_text_vi}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
