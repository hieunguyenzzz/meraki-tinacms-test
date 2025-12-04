'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useTina, tinaField } from 'tinacms/dist/react';
import Header from './Header';
import Footer from './Footer';
import JournalTemplate from './JournalTemplate';
import Lightbox from './Lightbox';
import ImageGalleryBlock from './blocks/ImageGalleryBlock';
import TwoImagesAsymmetryBlock from './blocks/TwoImagesAsymmetryBlock';
import TextBlock from './blocks/TextBlock';
import SpacingBlock from './blocks/SpacingBlock';

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
              return (
                <ImageGalleryBlock
                  key={blockIndex}
                  data={block}
                  lang={lang}
                  blockIndex={blockIndex}
                  indexMap={indexMap}
                  onImageClick={openLightbox}
                />
              );
            }

            // Two Images Asymmetry (Offset)
            if (blockType === 'TwoImagesAsymmetry') {
              return (
                <TwoImagesAsymmetryBlock
                  key={blockIndex}
                  data={block}
                  lang={lang}
                  blockIndex={blockIndex}
                  indexMap={indexMap}
                  onImageClick={openLightbox}
                />
              );
            }

            // Text Block
            if (blockType === 'TextBlock') {
              return <TextBlock key={blockIndex} data={block} lang={lang} />;
            }

            // Spacing Block
            if (blockType === 'Spacing') {
              return <SpacingBlock key={blockIndex} data={block} />;
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
