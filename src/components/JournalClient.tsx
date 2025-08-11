'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTina, tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import Header from './Header';
import Footer from './Footer';

interface JournalClientProps {
  data: any;
  variables: any;
  query: string;
  lang: string;
  slug: string;
}

export default function JournalClient({ data, variables, query, lang }: JournalClientProps) {
  const { data: tinaData } = useTina({ data, variables, query });
  const journal = tinaData.journal;

  // Get language-specific content
  const subtitle = lang === 'vi' ? journal.subtitle_vi : journal.subtitle_en;

  return (
    <div className='min-h-screen bg-white'>
      <Header lang={lang} />

      {/* Hero Section */}
      {journal.hero?.image && (
        <div className='relative h-screen'>
          <img
            src={journal.hero.image}
            alt={journal.couple_names}
            className='w-full h-full object-cover'
            data-tina-field={tinaField(journal.hero, 'image')}
          />
          <div className='absolute inset-0 bg-black/20' />
          <div className='absolute bottom-0 left-0 right-0 p-8 text-white'>
            <div className='max-w-4xl mx-auto'>
              <h1
                className='text-4xl md:text-6xl font-light mb-4'
                data-tina-field={tinaField(journal, 'couple_names')}>
                {journal.couple_names}
              </h1>
              <p
                className='text-xl md:text-2xl font-light'
                data-tina-field={tinaField(
                  journal,
                  lang === 'vi' ? 'subtitle_vi' : 'subtitle_en'
                )}>
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content Blocks */}
      {journal.content_blocks && (
        <div className='py-16'>
          {journal.content_blocks.map((block: any, index: number) => {
            // Check block type by the fields it has rather than _template
            if (block.heading_en && block.content_en && block.image) {
              const heading =
                lang === 'vi' ? block.heading_vi : block.heading_en;
              const content =
                lang === 'vi' ? block.content_vi : block.content_en;

              return (
                <div key={index} className='mb-16'>
                  <div className='max-w-4xl mx-auto px-8'>
                    <div className='grid md:grid-cols-2 gap-12 items-center'>
                      <div>
                        <h2
                          className='text-3xl font-light mb-6'
                          data-tina-field={tinaField(
                            block,
                            lang === 'vi' ? 'heading_vi' : 'heading_en'
                          )}>
                          {heading}
                        </h2>
                        <div
                          className='prose prose-lg text-gray-700 leading-relaxed'
                          data-tina-field={tinaField(
                            block,
                            lang === 'vi' ? 'content_vi' : 'content_en'
                          )}>
                          <TinaMarkdown content={content} />
                        </div>
                      </div>
                      <div className='order-first md:order-last'>
                        <img
                          src={block.image}
                          alt=''
                          className='w-full h-auto rounded-lg shadow-lg'
                          data-tina-field={tinaField(block, 'image')}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Gallery block
            if (block.images && Array.isArray(block.images)) {
              const heading =
                lang === 'vi' ? block.heading_vi : block.heading_en;

              return (
                <div key={index} className='mb-16'>
                  <div className='max-w-6xl mx-auto px-8'>
                    {heading && (
                      <h2
                        className='text-3xl font-light mb-8 text-center'
                        data-tina-field={tinaField(
                          block,
                          lang === 'vi' ? 'heading_vi' : 'heading_en'
                        )}>
                        {heading}
                      </h2>
                    )}
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {block.images.map((img: any, imgIndex: number) => {
                        const altText = lang === 'vi' ? img.alt_vi : img.alt_en;
                        return (
                          <div
                            key={imgIndex}
                            className='aspect-square overflow-hidden rounded-lg'>
                            <img
                              src={img.image}
                              alt={altText || ''}
                              className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                              data-tina-field={tinaField(img, 'image')}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }

            // Quote block
            if (block.quote_en || block.quote_vi) {
              const quote = lang === 'vi' ? block.quote_vi : block.quote_en;

              return (
                <div key={index} className='mb-16'>
                  <div className='max-w-4xl mx-auto px-8 text-center'>
                    <blockquote
                      className='text-2xl md:text-3xl font-light italic text-gray-800 mb-4'
                      data-tina-field={tinaField(
                        block,
                        lang === 'vi' ? 'quote_vi' : 'quote_en'
                      )}>
                      &ldquo;{quote}&rdquo;
                    </blockquote>
                    {block.author && (
                      <cite
                        className='text-lg text-gray-600'
                        data-tina-field={tinaField(block, 'author')}>
                        — {block.author}
                      </cite>
                    )}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      <Footer lang={lang} />
    </div>
  );
}
