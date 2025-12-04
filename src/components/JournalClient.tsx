'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import Header from './Header';
import Footer from './Footer';
import JournalTemplate from './JournalTemplate';
import Lightbox from './Lightbox';

interface LightboxImage {
  image: string;
  alt_en?: string;
  alt_vi?: string;
}

interface JournalClientProps {
  data: any;
  variables: any;
  query: string;
  lang: string;
  slug: string;
}

export default function JournalClient({
  data,
  variables,
  query,
  lang,
}: JournalClientProps) {
  const { data: tinaData } = useTina({ data, variables, query });
  const journal = tinaData.journal;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Collect all images from content blocks
  const { allImages, indexMap } = useMemo(() => {
    const images: LightboxImage[] = [];
    const map: Record<string, number> = {};

    journal.content_blocks?.forEach((block: any, blockIndex: number) => {
      const blockType = block.__typename?.replace('JournalContent_blocks', '') || '';

      if (blockType === 'ImageGallery' && block.images) {
        block.images.forEach((img: any, imgIndex: number) => {
          map[`${blockIndex}-${imgIndex}`] = images.length;
          images.push({
            image: img.src,
            alt_en: img.alt_en,
            alt_vi: img.alt_vi,
          });
        });
      }

      if (blockType === 'TwoImagesAsymmetry') {
        if (block.image_left) {
          map[`${blockIndex}-left`] = images.length;
          images.push({ image: block.image_left });
        }
        if (block.image_right) {
          map[`${blockIndex}-right`] = images.length;
          images.push({ image: block.image_right });
        }
      }
    });

    return { allImages: images, indexMap: map };
  }, [journal.content_blocks]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className='bg-background-1'>
      <Header lang={lang} />

      <JournalTemplate journal={journal} lang={lang} />
      {/* Content Blocks */}
      {journal.content_blocks && journal.content_blocks.length > 0 && (
        <div className='py-16 space-y-16'>
          {journal.content_blocks.map((block: any, blockIndex: number) => {
            const blockType = block.__typename?.replace('JournalContent_blocks', '') || '';

            // Image Gallery (1-4 columns, flexible number of images)
            if (blockType === 'ImageGallery') {
              const caption = lang === 'vi' ? block.caption_vi : block.caption_en;
              const columns = block.columns || '1';
              const gridClass =
                columns === '1' ? 'grid-cols-1' :
                  columns === '2' ? 'grid-cols-1 md:grid-cols-2' :
                    columns === '3' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                      'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

              return (
                <div key={blockIndex} className='max-w-[1400px] mx-auto px-8'>
                  <div className={`grid ${gridClass} gap-4`}>
                    {block.images?.map((img: any, imgIndex: number) => {
                      const altText = lang === 'vi' ? img.alt_vi : img.alt_en;
                      const globalIndex = indexMap[`${blockIndex}-${imgIndex}`];
                      return (
                        <button
                          key={imgIndex}
                          type='button'
                          className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                          onClick={() => openLightbox(globalIndex)}
                          aria-label={altText || 'View image in gallery'}
                        >
                          <img
                            src={img.src}
                            alt={altText || ''}
                            className='w-full h-auto'
                            data-tina-field={tinaField(img, 'src')}
                            loading='lazy'
                          />
                        </button>
                      );
                    })}
                  </div>
                  {caption && (
                    <p
                      className='mt-4 text-center text-gray-600 text-sm'
                      data-tina-field={tinaField(block, lang === 'vi' ? 'caption_vi' : 'caption_en')}
                    >
                      {caption}
                    </p>
                  )}
                </div>
              );
            }

            // Two Images Asymmetry (Offset)
            if (blockType === 'TwoImagesAsymmetry') {
              const caption = lang === 'vi' ? block.caption_vi : block.caption_en;
              const offset = block.offset || 'up';
              const leftOffset = offset === 'up' ? '-mt-12 md:-mt-12' : 'mt-12 md:mt-12';
              const rightOffset = offset === 'up' ? 'mt-12 md:mt-12' : '-mt-12 md:-mt-12';
              const leftIndex = indexMap[`${blockIndex}-left`];
              const rightIndex = indexMap[`${blockIndex}-right`];

              return (
                <div key={blockIndex} className='max-w-[1400px] mx-auto px-8'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className={leftOffset}>
                      <button
                        type='button'
                        className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                        onClick={() => openLightbox(leftIndex)}
                        aria-label='View image in gallery'
                      >
                        <img
                          src={block.image_left}
                          alt=''
                          className='w-full h-auto object-cover'
                          data-tina-field={tinaField(block, 'image_left')}
                          loading='lazy'
                        />
                      </button>
                    </div>
                    <div className={rightOffset}>
                      <button
                        type='button'
                        className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
                        onClick={() => openLightbox(rightIndex)}
                        aria-label='View image in gallery'
                      >
                        <img
                          src={block.image_right}
                          alt=''
                          className='w-full h-auto object-cover'
                          data-tina-field={tinaField(block, 'image_right')}
                          loading='lazy'
                        />
                      </button>
                    </div>
                  </div>
                  {caption && (
                    <p
                      className='mt-4 text-center text-gray-600 text-sm'
                      data-tina-field={tinaField(block, lang === 'vi' ? 'caption_vi' : 'caption_en')}
                    >
                      {caption}
                    </p>
                  )}
                </div>
              );
            }

            // Text Block
            if (blockType === 'TextBlock') {
              const title = lang === 'vi' ? block.title_vi : block.title_en;
              const description = lang === 'vi' ? block.description_vi : block.description_en;
              const alignment = block.alignment || 'center';
              const alignClass = alignment === 'left' ? 'text-left' : alignment === 'right' ? 'text-right' : 'text-center';

              return (
                <div key={blockIndex} className={`max-w-[640px] mx-auto px-8 ${alignClass}`}>
                  {title && (
                    <h2
                      className='text-h3 mb-4'
                      data-tina-field={tinaField(block, lang === 'vi' ? 'title_vi' : 'title_en')}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      className='text-body-md text-text-secondary leading-relaxed whitespace-pre-line'
                      data-tina-field={tinaField(block, lang === 'vi' ? 'description_vi' : 'description_en')}
                    >
                      {description}
                    </p>
                  )}
                </div>
              );
            }

            // Spacing Block
            if (blockType === 'Spacing') {
              const size = block.size || 'md';
              const heightClass =
                size === 'sm' ? 'h-6' :
                size === 'lg' ? 'h-18' :
                size === 'xl' ? 'h-24' :
                'h-12';

              return <div key={blockIndex} className={heightClass} aria-hidden='true' />;
            }

            return null;
          })}
        </div>
      )}

      {/* Testimonial Section */}
      {journal.testimonial && (
        <div className='bg-paper px-12 py-20'>
          <div className='max-w-[446px] mx-auto text-center'>
            {/* Testimonial Heading */}
            <div className='text-h3 mb-3'>
              Testimonial
            </div>

            {/* Decorative Script Text */}
            {journal.testimonial?.decorative_text && (
              <div
                className='text-handwriting text-h4 mb-3 text-center'
                data-tina-field={tinaField(journal.testimonial, 'decorative_text')}>
                {journal.testimonial.decorative_text}
              </div>
            )}

            {/* Quote */}
            {(lang === 'vi' ? journal.testimonial?.quote_vi : journal.testimonial?.quote_en) && (
              <p
                className='text-center text-text-secondary text-body-sm'
                data-tina-field={tinaField(
                  journal.testimonial,
                  lang === 'vi' ? 'quote_vi' : 'quote_en'
                )}>
                {lang === 'vi' ? journal.testimonial.quote_vi : journal.testimonial.quote_en}
              </p>
            )}
          </div>
        </div>
      )}

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
