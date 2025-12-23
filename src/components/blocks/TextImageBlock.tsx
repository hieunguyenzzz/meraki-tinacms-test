'use client';

import { tinaField } from 'tinacms/dist/react';
import { cn } from '@/lib/utils';
import MerakiImage from '../ui/MerakiImage';
import { getThumborUrl } from '@/lib/image';

interface TextImageBlockData extends Record<string, unknown> {
  layout?: string;
  title_en?: string;
  title_vi?: string;
  description_en?: string;
  description_vi?: string;
  image?: string;
}

interface TextImageBlockProps {
  data: TextImageBlockData;
  lang: string;
  blockIndex?: number;
  indexMap?: Record<string, number>;
  onImageClick?: (index: number) => void;
}

export default function TextImageBlock({ 
  data, 
  lang,
  blockIndex,
  indexMap,
  onImageClick 
}: TextImageBlockProps) {
  const isTextLeft = data.layout === 'text-left';
  const title = lang === 'vi' ? data.title_vi : data.title_en;
  const description = lang === 'vi' ? data.description_vi : data.description_en;

  const handleImageClick = () => {
    if (onImageClick && indexMap && blockIndex !== undefined) {
      const index = indexMap[`${blockIndex}-image`];
      if (index !== undefined) {
        onImageClick(index);
      }
    }
  };

  return (
    <div className="max-w-[968px] mx-auto px-6">
      <div className={cn(
        "flex flex-col gap-6 items-center",
        isTextLeft ? "md:flex-row" : "md:flex-row-reverse"
      )}>
        {/* Text Section */}
        <div className="flex-1 w-full md:w-1/2">
          <div className={cn("max-w-lg", isTextLeft ? "mr-auto" : "ml-auto")}>
            {title && (
              <h2
                className="text-h3 mb-4"
                data-tina-field={tinaField(data, lang === 'vi' ? 'title_vi' : 'title_en')}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className="text-body-md text-text-secondary leading-relaxed whitespace-pre-line"
                data-tina-field={tinaField(data, lang === 'vi' ? 'description_vi' : 'description_en')}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 w-full md:w-1/2">
          {data.image && (
            <div 
              className={cn(
                "relative aspect-[4/5] w-full overflow-hidden rounded-sm",
                onImageClick && "cursor-pointer hover:opacity-95 transition-opacity"
              )}
              data-tina-field={tinaField(data, 'image')}
              onClick={handleImageClick}
            >
              <MerakiImage
                src={getThumborUrl('400x400', data.image)}
                alt={title || 'Image'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
