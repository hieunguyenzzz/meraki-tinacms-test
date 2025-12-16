'use client';

import { tinaField } from 'tinacms/dist/react';
import MerakiImage from '../ui/MerakiImage';
import { getThumborUrl } from '@/lib/image';

interface TwoImagesAsymmetryBlockData extends Record<string, unknown> {
  caption_en?: string;
  caption_vi?: string;
  offset?: string;
  image_left: string;
  image_right: string;
}

interface TwoImagesAsymmetryBlockProps {
  data: TwoImagesAsymmetryBlockData;
  lang: string;
  blockIndex: number;
  indexMap: Record<string, number>;
  onImageClick: (index: number) => void;
}

export default function TwoImagesAsymmetryBlock({
  data,
  lang,
  blockIndex,
  indexMap,
  onImageClick,
}: TwoImagesAsymmetryBlockProps) {
  const caption = lang === 'vi' ? data.caption_vi : data.caption_en;
  const offset = data.offset || 'up';
  const leftOffset = offset === 'up' ? '-mt-12 md:-mt-12' : 'mt-12 md:mt-12';
  const rightOffset = offset === 'up' ? 'mt-12 md:mt-12' : '-mt-12 md:-mt-12';
  const leftIndex = indexMap[`${blockIndex}-left`];
  const rightIndex = indexMap[`${blockIndex}-right`];

  return (
    <div className='max-w-[920px] mx-auto px-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className={leftOffset}>
          <button
            type='button'
            className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            onClick={() => onImageClick(leftIndex)}
            aria-label='View image in gallery'
          >
            <MerakiImage
              src={getThumborUrl('400x400', data.image_left)}
              alt=''
              className='w-full h-auto object-cover'
              data-tina-field={tinaField(data, 'image_left')}
              useNativeImg={true}
            />
          </button>
        </div>
        <div className={rightOffset}>
          <button
            type='button'
            className='w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
            onClick={() => onImageClick(rightIndex)}
            aria-label='View image in gallery'
          >
            <MerakiImage
              src={getThumborUrl('400x400', data.image_right)}
              alt=''
              className='w-full h-auto object-cover'
              data-tina-field={tinaField(data, 'image_right')}
              useNativeImg={true}
            />
          </button>
        </div>
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
