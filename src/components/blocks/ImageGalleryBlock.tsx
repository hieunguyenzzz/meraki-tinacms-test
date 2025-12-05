'use client';

import { tinaField } from 'tinacms/dist/react';

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
  const gridClass =
    columns === '1'
      ? 'grid-cols-1'
      : columns === '2'
      ? 'grid-cols-1 md:grid-cols-2'
      : columns === '3'
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  return (
    <div className='max-w-[1400px] mx-auto px-8'>
      <div className={`grid ${gridClass} gap-6`}>
        {data.images?.map((img, imgIndex: number) => {
          const altText = lang === 'vi' ? img.alt_vi : img.alt_en;
          const globalIndex = indexMap[`${blockIndex}-${imgIndex}`];
          return (
            <button
              key={imgIndex}
              type='button'
              className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
              onClick={() => onImageClick(globalIndex)}
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
