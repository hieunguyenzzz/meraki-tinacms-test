'use client';

import { type AltFallback, resolveImageAlt } from '@/lib/image-alt';
import { tinaField } from 'tinacms/dist/react';
import MerakiImage from '../ui/MerakiImage';

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
  /** Page context used to fill in the alt text — this block has no alt fields. */
  altFallback?: AltFallback;
}

export default function TwoImagesAsymmetryBlock({
  data,
  lang,
  blockIndex,
  indexMap,
  onImageClick,
  altFallback,
}: TwoImagesAsymmetryBlockProps) {
  const caption = lang === 'vi' ? data.caption_vi : data.caption_en;
  const offset = data.offset || 'up';
  const leftOffset = offset === 'up' ? 'md:-mt-[90px]' : 'md:mt-[90px]';
  const rightOffset = offset === 'up' ? 'md:mt-[90px]' : 'md:-mt-[90px]';
  const leftIndex = indexMap[`${blockIndex}-left`];
  const rightIndex = indexMap[`${blockIndex}-right`];

  const altFor = (index: number) =>
    resolveImageAlt(
      null,
      altFallback,
      lang,
      Number.isFinite(index) ? index + 1 : undefined
    );
  const leftAlt = altFor(leftIndex);
  const rightAlt = altFor(rightIndex);

  return (
    <div className="max-w-[968px] mx-auto px-4 md:px-6">
      <div className="grid grid-cols-1 gap-6 md:mt-[120px] md:grid-cols-2">
        <div className={leftOffset}>
          <button
            type="button"
            className="w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => onImageClick(leftIndex)}
            aria-label={leftAlt || 'View image in gallery'}
          >
            <MerakiImage
              src={data.image_left}
              alt={leftAlt}
              className="w-full h-auto object-cover"
              data-tina-field={tinaField(data, 'image_left')}
              width={400}
              sizes="(min-width: 968px) 448px, (min-width: 744px) calc(50vw - 36px), calc(100vw - 32px)"
            />
          </button>
        </div>
        <div className={rightOffset}>
          <button
            type="button"
            className="w-full cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => onImageClick(rightIndex)}
            aria-label={rightAlt || 'View image in gallery'}
          >
            <MerakiImage
              src={data.image_right}
              alt={rightAlt}
              className="w-full h-auto object-cover"
              data-tina-field={tinaField(data, 'image_right')}
              width={480}
              sizes="(min-width: 968px) 448px, (min-width: 744px) calc(50vw - 36px), calc(100vw - 32px)"
            />
          </button>
        </div>
      </div>
      {caption && (
        <p
          className="mt-4 text-center text-gray-600 text-sm"
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
