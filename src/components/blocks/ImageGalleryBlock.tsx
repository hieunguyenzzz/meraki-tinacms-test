'use client';

import { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const masonryRef = useRef<any>(null);

  const caption = lang === 'vi' ? data.caption_vi : data.caption_en;
  const columns = data.columns || '1';

  // Map columns to item width classes
  const itemWidthClass =
    columns === '1'
      ? 'w-full'
      : columns === '2'
      ? 'w-full md:w-[calc(50%-12px)]'
      : columns === '3'
      ? 'w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
      : 'w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]';

  useEffect(() => {
    let masonry: any = null;
    let imgLoaded: any = null;

    const initMasonry = async () => {
      const Masonry = (await import('masonry-layout')).default;
      const imagesLoaded = (await import('imagesloaded')).default;

      if (!containerRef.current) return;

      masonry = new Masonry(containerRef.current, {
        itemSelector: '.masonry-item',
        columnWidth: '.grid-sizer',
        gutter: 24,
        percentPosition: true,
        transitionDuration: '0.3s',
      });

      masonryRef.current = masonry;

      imgLoaded = imagesLoaded(containerRef.current);
      imgLoaded.on('progress', () => {
        masonry?.layout();
      });
      
      // Initial layout after a short delay to ensure styles are applied
      setTimeout(() => {
        masonry?.layout();
      }, 100);
    };

    initMasonry();

    return () => {
      masonry?.destroy();
      imgLoaded?.off('progress');
    };
  }, [data.images, columns]);

  return (
    <div className='max-w-[968px] mx-auto px-6'>
      <div ref={containerRef} className="w-full relative">
        {/* Sizer element for Masonry */}
        <div className={`grid-sizer ${itemWidthClass} absolute invisible`} />
        
        {data.images?.map((img, imgIndex: number) => {
          const altText = lang === 'vi' ? img.alt_vi : img.alt_en;
          const globalIndex = indexMap[`${blockIndex}-${imgIndex}`];
          return (
            <button
              key={imgIndex}
              type='button'
              className={`masonry-item ${itemWidthClass} cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary block mb-6`}
              onClick={() => onImageClick(globalIndex)}
              aria-label={altText || 'View image in gallery'}
            >
              <MerakiImage
                src={getThumborUrl('400x400', img.src)}
                alt={altText || ''}
                className='w-full h-auto block'
                data-tina-field={tinaField(img, 'src')}
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
