'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import { getThumborUrl } from '@/lib/image';
import Header from './Header';
import Footer from './Footer';
import JournalTemplate from './JournalTemplate';
import Lightbox from './Lightbox';
import ImageGalleryBlock from './blocks/ImageGalleryBlock';
import TwoImagesAsymmetryBlock from './blocks/TwoImagesAsymmetryBlock';
import TextBlock from './blocks/TextBlock';
import SpacingBlock from './blocks/SpacingBlock';
import TextImageBlock from './blocks/TextImageBlock';
import TestimonialBlock from './blocks/TestimonialBlock';

interface LightboxImage {
  image: string;
  thumbnail?: string;
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
            image: getThumborUrl('1000x1000', img.src),
            thumbnail: getThumborUrl('75x75', img.src),
            alt_en: img.alt_en,
            alt_vi: img.alt_vi,
          });
        });
      }

      if (blockType === 'TwoImagesAsymmetry') {
        if (block.image_left) {
          map[`${blockIndex}-left`] = images.length;
          images.push({ 
            image: getThumborUrl('1000x1000', block.image_left),
            thumbnail: getThumborUrl('75x75', block.image_left)
          });
        }
        if (block.image_right) {
          map[`${blockIndex}-right`] = images.length;
          images.push({ 
            image: getThumborUrl('1000x1000', block.image_right),
            thumbnail: getThumborUrl('75x75', block.image_right)
          });
        }
      }

      if (blockType === 'TextImageBlock' && block.image) {
        map[`${blockIndex}-image`] = images.length;
        images.push({
          image: getThumborUrl('1000x1000', block.image),
          thumbnail: getThumborUrl('75x75', block.image),
          alt_en: block.image_alt_en,
          alt_vi: block.image_alt_vi,
        });
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

            // Text + Image Block
            if (blockType === 'TextImageBlock') {
              return (
                <TextImageBlock
                  key={blockIndex}
                  data={block}
                  lang={lang}
                  blockIndex={blockIndex}
                  indexMap={indexMap}
                  onImageClick={openLightbox}
                />
              );
            }

            // Testimonial Block
            if (blockType === 'Testimonial') {
              return <TestimonialBlock key={blockIndex} data={block} lang={lang} />;
            }

            return null;
          })}
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
