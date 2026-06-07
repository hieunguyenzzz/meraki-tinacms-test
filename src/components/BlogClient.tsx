'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import ContentBlocksRenderer, { collectLightboxImages } from './ContentBlocksRenderer';
import Footer from './Footer';
import Header from './Header';
import MerakiImage from './ui/MerakiImage';

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

  const { indexMap } = useMemo(() => {
    return collectLightboxImages(
      blog.content_blocks || [],
      'BlogContent_blocks',
    );
  }, [blog.content_blocks]);

  const title = lang === 'en' ? blog.title_en : blog.title_vi;
  const excerpt = lang === 'en' ? blog.excerpt_en : blog.excerpt_vi;

  const byline = t(
    { en: 'Written by Meraki Team', vi: 'Viết bởi Meraki Team' },
    lang,
  );

  const publishedDate = blog.published_date
    ? new Date(blog.published_date).toLocaleDateString(
      lang === 'en' ? 'en-GB' : 'vi-VN',
    )
    : null;

  const hasContentBlocks =
    blog.content_blocks && blog.content_blocks.length > 0;

  return (
    <div className='bg-background-1'>
      <Header lang={lang} />

      {/* Article Hero Banner */}
      <article>
        <section className='grid grid-cols-1 lg:grid-cols-2'>
          <div
            className='relative min-h-[360px] md:min-h-[520px] lg:min-h-[720px] overflow-hidden'
            data-tina-field={tinaField(blog, 'featured_image')}>
            {blog.featured_image ? (
              <MerakiImage
                src={blog.featured_image}
                alt={title}
                fill
                className='object-cover object-center'
                priority
              />
            ) : (
              <div className='h-full w-full bg-background-2' />
            )}
          </div>

          <div className='bg-background-base flex items-center justify-center px-8 py-14 md:px-10 md:py-20'>
            <div className='w-full text-center'>
              {blog.categories && blog.categories.length > 0 && (
                <div className='mb-6'>
                  <p className='text-body-md text-text-secondary tracking-[0.16em] border-t-text-primary border-t-[1px] inline-block py-1 border-b-text-primary border-b-[1px]'>
                    {blog.categories[0]}
                  </p>
                  <div className='mx-auto mt-2 h-px w-20 bg-line-primary/70' />
                </div>
              )}

              <h1
                className='text-h1 md:text-display font-vocago uppercase tracking-wide leading-tight'
                data-tina-field={tinaField(
                  blog,
                  lang === 'en' ? 'title_en' : 'title_vi',
                )}>
                {title}
              </h1>

              <div className='mt-6 flex items-center justify-center gap-3 text-body-sm uppercase tracking-[0.12em] text-text-secondary'>
                <span>{byline}</span>
                {publishedDate && (
                  <time dateTime={blog.published_date}>{publishedDate}</time>
                )}
              </div>

              {excerpt && (
                <p
                  className='mt-12 text-body-lg text-text-secondary leading-relaxed mx-auto text-justify'
                  data-tina-field={tinaField(
                    blog,
                    lang === 'en' ? 'excerpt_en' : 'excerpt_vi',
                  )}>
                  {excerpt}
                </p>
              )}
            </div>
          </div>
        </section>
      </article>

      {/* Content Blocks (block builder) */}
      {hasContentBlocks && (
        <ContentBlocksRenderer
          blocks={blog.content_blocks}
          lang={lang}
          typenamePrefix='BlogContent_blocks'
          indexMap={indexMap}
          onImageClick={() => { }}
          wrapperClassName='py-16 space-y-4 text-justify'
        />
      )}

      <Footer lang={lang} />
    </div>
  );
}
