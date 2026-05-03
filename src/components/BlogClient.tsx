'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Link from 'next/link';
import Header from './Header';
import Footer from './Footer';
import MerakiImage from './ui/MerakiImage';
import Lightbox from './Lightbox';
import ContentBlocksRenderer, { collectLightboxImages } from './ContentBlocksRenderer';

interface BlogClientProps {
  data: any;
  variables: any;
  query: string;
  lang: string;
}

const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

export default function BlogClient({
  data,
  variables,
  query,
  lang,
}: BlogClientProps) {
  const { data: tinaData } = useTina({ data, variables, query });
  const blog = tinaData.blog;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { allImages, indexMap } = useMemo(() => {
    return collectLightboxImages(
      blog.content_blocks || [],
      'BlogContent_blocks',
    );
  }, [blog.content_blocks]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () =>
    setCurrentIndex((prev) => (prev + 1) % allImages.length);

  const handlePrev = () =>
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const title = lang === 'en' ? blog.title_en : blog.title_vi;
  const excerpt = lang === 'en' ? blog.excerpt_en : blog.excerpt_vi;
  const bodyContent = lang === 'en' ? blog.content_en : blog.content_vi;

  const publishedDate = blog.published_date
    ? new Date(blog.published_date).toLocaleDateString(
        lang === 'en' ? 'en-US' : 'vi-VN',
        { year: 'numeric', month: 'long', day: 'numeric' },
      )
    : null;

  const hasContentBlocks =
    blog.content_blocks && blog.content_blocks.length > 0;
  const hasRichText = bodyContent && bodyContent.children?.length > 0;

  return (
    <div className='bg-background-1'>
      <Header lang={lang} />

      {/* Article Header */}
      <article>
        {/* Hero / Featured Image */}
        {blog.featured_image && (
          <div
            className='relative w-full h-[60vh] overflow-hidden'
            data-tina-field={tinaField(blog, 'featured_image')}>
            <MerakiImage
              src={blog.featured_image}
              alt={title}
              fill
              className='object-cover object-center'
              priority
            />
          </div>
        )}

        {/* Article Meta */}
        <div className='max-w-[968px] mx-auto px-6 pt-16 pb-8'>
          {/* Breadcrumb */}
          <nav className='flex mb-8 text-body-sm text-text-secondary' aria-label='Breadcrumb'>
            <ol className='flex items-center gap-2'>
              <li>
                <Link href={`/${lang}`} className='hover:text-text-primary transition-colors'>
                  {t({ en: 'Home', vi: 'Trang chủ' }, lang)}
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li>
                <Link href={`/${lang}/blog`} className='hover:text-text-primary transition-colors'>
                  {t({ en: 'Blog', vi: 'Blog' }, lang)}
                </Link>
              </li>
              <li aria-hidden>›</li>
              <li className='text-text-primary truncate max-w-[200px]'>{title}</li>
            </ol>
          </nav>

          {/* Categories */}
          {blog.categories && blog.categories.length > 0 && (
            <div className='flex flex-wrap gap-3 mb-6'>
              {blog.categories.map((category: string, idx: number) => (
                <span
                  key={idx}
                  className='text-body-sm text-text-secondary uppercase tracking-wider'>
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1
            className='text-display font-vocago uppercase tracking-wider mb-6'
            data-tina-field={tinaField(
              blog,
              lang === 'en' ? 'title_en' : 'title_vi',
            )}>
            {title}
          </h1>

          {/* Excerpt */}
          {excerpt && (
            <p
              className='text-body-lg text-text-secondary leading-relaxed mb-6'
              data-tina-field={tinaField(
                blog,
                lang === 'en' ? 'excerpt_en' : 'excerpt_vi',
              )}>
              {excerpt}
            </p>
          )}

          {/* Date */}
          {publishedDate && (
            <time
              dateTime={blog.published_date}
              className='text-body-sm text-text-secondary'>
              {publishedDate}
            </time>
          )}
        </div>
      </article>

      {/* Content Blocks (block builder) */}
      {hasContentBlocks && (
        <ContentBlocksRenderer
          blocks={blog.content_blocks}
          lang={lang}
          typenamePrefix='BlogContent_blocks'
          indexMap={indexMap}
          onImageClick={openLightbox}
        />
      )}

      {/* Fallback: rich-text content_en / content_vi */}
      {!hasContentBlocks && hasRichText && (
        <div className='max-w-[968px] mx-auto px-6 py-16'>
          <div
            className='prose prose-lg max-w-none'
            data-tina-field={tinaField(
              blog,
              lang === 'en' ? 'content_en' : 'content_vi',
            )}>
            <TinaMarkdown content={bodyContent} />
          </div>
        </div>
      )}

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className='max-w-[968px] mx-auto px-6 pb-12'>
          <div className='pt-8 border-t border-background-2'>
            <h3 className='text-body-sm uppercase tracking-wider text-text-secondary mb-3'>
              {t({ en: 'Tags', vi: 'Thẻ' }, lang)}
            </h3>
            <div className='flex flex-wrap gap-2'>
              {blog.tags.map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className='text-body-sm text-text-secondary border border-background-2 px-3 py-1'>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className='py-20 bg-background-2'>
        <div className='max-w-3xl mx-auto px-6 text-center space-y-6'>
          <div className='flex items-center justify-center'>
            <MerakiImage
              src='/images/botanical/2.svg'
              alt='Decorative botanical element'
              className='w-[48px] h-auto'
              width={48}
              height={48}
            />
          </div>
          <h2 className='text-h2 font-vocago'>
            {t({ en: "Let's Plan Your Wedding", vi: 'Hãy lên kế hoạch đám cưới của bạn' }, lang)}
          </h2>
          <p className='text-body-md text-text-secondary max-w-xl mx-auto'>
            {t(
              {
                en: 'Our experienced wedding planners are here to help you create the perfect celebration.',
                vi: 'Các nhà tổ chức đám cưới có kinh nghiệm của chúng tôi sẵn sàng giúp bạn tạo ra lễ kỷ niệm hoàn hảo.',
              },
              lang,
            )}
          </p>
          <div className='flex flex-wrap gap-4 justify-center'>
            <Link
              href={`/${lang}/lets-connect`}
              className='inline-block text-body-md text-text-primary hover:text-text-accent transition-colors border-b border-text-primary hover:border-text-accent'>
              {t({ en: 'Get in Touch', vi: 'Liên hệ' }, lang)}
            </Link>
            <span className='text-text-secondary'>·</span>
            <Link
              href={`/${lang}/blog`}
              className='inline-block text-body-md text-text-secondary hover:text-text-primary transition-colors'>
              {t({ en: 'Back to Blog', vi: 'Quay lại Blog' }, lang)}
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        isOpen={lightboxOpen}
        currentIndex={currentIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        lang={lang}
      />

      <Footer lang={lang} />
    </div>
  );
}
