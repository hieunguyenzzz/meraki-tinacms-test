/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { type AltFallback, resolveImageAlt } from '@/lib/image-alt';
import { cn } from '@/lib/utils';
import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';
import MerakiImage from '../ui/MerakiImage';

interface TextImageBlockData extends Record<string, unknown> {
  layout?: string;
  verticalAlignment?: string;
  title_en?: string;
  title_vi?: string;
  description_en?: any;
  description_vi?: any;
  image?: string;
  image_alt_en?: string;
  image_alt_vi?: string;
}

interface TextImageBlockProps {
  data: TextImageBlockData;
  lang: string;
  blockIndex?: number;
  indexMap?: Record<string, number>;
  onImageClick?: (index: number) => void;
  centerTitle?: boolean;
  altFallback?: AltFallback;
}

export default function TextImageBlock({
  data,
  lang,
  blockIndex,
  indexMap,
  onImageClick,
  centerTitle = false,
  altFallback,
}: TextImageBlockProps) {
  const isTextLeft = data.layout === 'text-left';
  const verticalAlignment = data.verticalAlignment || 'center';
  const title = lang === 'vi' ? data.title_vi : data.title_en;
  const description = lang === 'vi' ? data.description_vi : data.description_en;
  const textAlignmentClass =
    verticalAlignment === 'top' ? 'md:self-start' : 'md:self-center';

  // The block's heading describes the prose beside the photo, not the photo, so
  // it is not usable as alt text. Fall back to the page context the sibling
  // image blocks already use.
  const lightboxIndex = indexMap?.[`${blockIndex}-image`];
  const imageAlt = resolveImageAlt(
    lang === 'vi' ? data.image_alt_vi : data.image_alt_en,
    altFallback,
    lang,
    typeof lightboxIndex === 'number' ? lightboxIndex + 1 : undefined
  );

  const handleImageClick = () => {
    if (onImageClick && indexMap && blockIndex !== undefined) {
      const index = indexMap[`${blockIndex}-image`];
      if (index !== undefined) {
        onImageClick(index);
      }
    }
  };

  return (
    <div className="max-w-[968px] mx-auto px-4 md:px-6">
      <div
        className={cn(
          'flex flex-col gap-6 items-center',
          isTextLeft ? 'md:flex-row' : 'md:flex-row-reverse'
        )}
      >
        {/* Text Section */}
        <div
          className={cn(
            'order-1 flex-1 w-full md:order-none md:w-1/2',
            textAlignmentClass
          )}
        >
          <div className={cn('max-w-lg', isTextLeft ? 'mr-auto' : 'ml-auto')}>
            {title && (
              <h2
                className={`text-h3 mb-4 ${
                  centerTitle ? 'text-center' : 'text-left'
                }`}
                data-tina-field={tinaField(
                  data,
                  lang === 'vi' ? 'title_vi' : 'title_en'
                )}
              >
                {title}
              </h2>
            )}
            {!!description && (
              <div
                className="text-body-md text-text-secondary leading-relaxed"
                data-tina-field={tinaField(
                  data,
                  lang === 'vi' ? 'description_vi' : 'description_en'
                )}
              >
                <TinaMarkdown
                  content={description}
                  components={{
                    p: (props: any) => (
                      <p
                        className="text-body-md text-text-secondary leading-relaxed mb-2 last:mb-0"
                        {...props}
                      />
                    ),
                    bold: (props: any) => (
                      <strong className="font-bold" {...props} />
                    ),
                    italic: (props: any) => (
                      <em className="italic" {...props} />
                    ),
                    a: ({ url, children }: any) => (
                      <a
                        className="underline hover:opacity-70 transition-opacity"
                        target="_blank"
                        href={url}
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Image Section */}
        <div className="order-2 flex-1 w-full md:order-none md:w-1/2">
          {data.image && (
            <div
              className={cn(
                'relative aspect-[4/5] w-full overflow-hidden rounded-sm',
                onImageClick &&
                  'cursor-pointer hover:opacity-95 transition-opacity'
              )}
              data-tina-field={tinaField(data, 'image')}
              onClick={handleImageClick}
            >
              <MerakiImage
                src={data.image}
                alt={imageAlt}
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
