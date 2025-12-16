'use client';

import { tinaField } from 'tinacms/dist/react';
import MerakiImage from '../ui/MerakiImage';
import { getThumborUrl } from '@/lib/image';

interface ImageItem extends Record<string, unknown> {
  src: string;
  alt_en: string;
  alt_vi: string;
}

interface ImageGalleryBlockData extends Record<string, unknown> {
  images?: ImageItem[];
  caption_en?: string;
  caption_vi?: string;
  columns?: string;
}

interface ImageGalleryBlockProps {
  data: ImageGalleryBlockData;
  lang: string;
  blockIndex: number;
  indexMap: Record<string, number>;
  onImageClick: (index: number) => void;
}

export default function ImageGalleryBlock({
  data,
  lang,
  blockIndex,
  indexMap,
  onImageClick,
}: ImageGalleryBlockProps) {
  const caption = lang === 'vi' ? data.caption_vi : data.caption_en;
  const columns = data.columns || '1';
  const columnClass =
    columns === '1'
      ? 'columns-1'
      : columns === '2'
      ? 'columns-1 md:columns-2'
      : columns === '3'
      ? 'columns-1 md:columns-2 lg:columns-3'
      : 'columns-1 md:columns-2 lg:columns-4';

  return (
    <div className='max-w-[920px] mx-auto px-8'>
      <div className={columnClass} style={{ columnGap: '1.5rem' }}>
        {data.images?.map((img, imgIndex: number) => {
          const altText = lang === 'vi' ? img.alt_vi : img.alt_en;
          const globalIndex = indexMap[`${blockIndex}-${imgIndex}`];
          return (
            <button
              key={imgIndex}
              type='button'
              className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary break-inside-avoid block mb-6'
              onClick={() => onImageClick(globalIndex)}
              aria-label={altText || 'View image in gallery'}
            >
              <MerakiImage
                src={getThumborUrl('400x400', img.src)}
                alt={altText || ''}
                className='w-full h-auto'
                data-tina-field={tinaField(img, 'src')}
                // We use native img here because we don't have dimensions for masonry layout
                // and Next.js Image requires width/height or fill (which needs fixed parent height)
                useNativeImg={true}
              />
            </button>
          );
        })}
      </div>
      {caption && (
        <p
          className='mt-4 text-center text-gray-600 text-sm'
          data-tina-field={tinaField(
            data,
            lang === 'vi' ? 'caption_vi' : 'caption_en'
          )}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
