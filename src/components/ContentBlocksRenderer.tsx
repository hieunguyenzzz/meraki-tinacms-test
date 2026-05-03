'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface ContentBlocksRendererProps {
  blocks: any[];
  lang: string;
  /** prefix used to derive __typename, e.g. 'JournalContent_blocks' or 'BlogContent_blocks' */
  typenamePrefix: string;
  indexMap: Record<string, number>;
  onImageClick: (index: number) => void;
}

export function collectLightboxImages(
  blocks: any[],
  typenamePrefix: string,
): { allImages: LightboxImage[]; indexMap: Record<string, number> } {
  const images: LightboxImage[] = [];
  const map: Record<string, number> = {};

  blocks?.forEach((block: any, blockIndex: number) => {
    const blockType = block.__typename?.replace(typenamePrefix, '') || '';

    if (blockType === 'ImageGallery' && block.images) {
      block.images.forEach((img: any, imgIndex: number) => {
        map[`${blockIndex}-${imgIndex}`] = images.length;
        images.push({
          image: img.src,
          thumbnail: img.src,
          alt_en: img.alt_en,
          alt_vi: img.alt_vi,
        });
      });
    }

    if (blockType === 'TwoImagesAsymmetry') {
      if (block.image_left) {
        map[`${blockIndex}-left`] = images.length;
        images.push({ image: block.image_left, thumbnail: block.image_left });
      }
      if (block.image_right) {
        map[`${blockIndex}-right`] = images.length;
        images.push({ image: block.image_right, thumbnail: block.image_right });
      }
    }

    if (blockType === 'TextImageBlock' && block.image) {
      map[`${blockIndex}-image`] = images.length;
      images.push({
        image: block.image,
        thumbnail: block.image,
        alt_en: block.image_alt_en,
        alt_vi: block.image_alt_vi,
      });
    }
  });

  return { allImages: images, indexMap: map };
}

export default function ContentBlocksRenderer({
  blocks,
  lang,
  typenamePrefix,
  indexMap,
  onImageClick,
}: ContentBlocksRendererProps) {
  return (
    <div className='py-16 space-y-16'>
      {blocks.map((block: any, blockIndex: number) => {
        const blockType = block.__typename?.replace(typenamePrefix, '') || '';

        if (blockType === 'ImageGallery') {
          return (
            <ImageGalleryBlock
              key={blockIndex}
              data={block}
              lang={lang}
              blockIndex={blockIndex}
              indexMap={indexMap}
              onImageClick={onImageClick}
            />
          );
        }

        if (blockType === 'TwoImagesAsymmetry') {
          return (
            <TwoImagesAsymmetryBlock
              key={blockIndex}
              data={block}
              lang={lang}
              blockIndex={blockIndex}
              indexMap={indexMap}
              onImageClick={onImageClick}
            />
          );
        }

        if (blockType === 'TextBlock') {
          return <TextBlock key={blockIndex} data={block} lang={lang} />;
        }

        if (blockType === 'Spacing') {
          return <SpacingBlock key={blockIndex} data={block} />;
        }

        if (blockType === 'TextImageBlock') {
          return (
            <TextImageBlock
              key={blockIndex}
              data={block}
              lang={lang}
              blockIndex={blockIndex}
              indexMap={indexMap}
              onImageClick={onImageClick}
            />
          );
        }

        if (blockType === 'Testimonial') {
          return <TestimonialBlock key={blockIndex} data={block} lang={lang} />;
        }

        return null;
      })}
    </div>
  );
}
