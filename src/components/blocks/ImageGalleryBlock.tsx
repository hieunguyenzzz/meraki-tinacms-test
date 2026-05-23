'use client';

import type Masonry from 'masonry-layout';
import { useEffect, useRef } from 'react';
import { tinaField } from 'tinacms/dist/react';
import MerakiImage from '../ui/MerakiImage';

interface ImageItem extends Record<string, unknown> {
  src: string;
  alt_en: string;
  alt_vi: string;
  width?: number;
  height?: number;
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
  const masonryRef = useRef<Masonry | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const relayoutTimeoutRef = useRef<number | null>(null);
  const relayoutRafRef = useRef<number | null>(null);

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
    let isCancelled = false;
    let detachImageListeners: (() => void) | null = null;

    const clearRelayoutTimers = () => {
      if (relayoutTimeoutRef.current !== null) {
        window.clearTimeout(relayoutTimeoutRef.current);
        relayoutTimeoutRef.current = null;
      }

      if (relayoutRafRef.current !== null) {
        window.cancelAnimationFrame(relayoutRafRef.current);
        relayoutRafRef.current = null;
      }
    };

    const scheduleLayout = (withReload = false) => {
      if (isCancelled || !masonryRef.current) return;

      if (relayoutRafRef.current !== null) {
        window.cancelAnimationFrame(relayoutRafRef.current);
      }

      relayoutRafRef.current = window.requestAnimationFrame(() => {
        if (withReload) {
          masonryRef.current?.reloadItems?.();
        }
        masonryRef.current?.layout?.();
      });
    };

    const bindImageLoadHandlers = (container: HTMLElement) => {
      const imageNodes = Array.from(container.querySelectorAll('img'));
      const disposers: Array<() => void> = [];

      imageNodes.forEach((img) => {
        const onImgReady = () => {
          scheduleLayout(true);
        };

        if (img.complete) {
          onImgReady();
          return;
        }

        img.addEventListener('load', onImgReady, { passive: true });
        img.addEventListener('error', onImgReady, { passive: true });

        disposers.push(() => {
          img.removeEventListener('load', onImgReady);
          img.removeEventListener('error', onImgReady);
        });
      });

      return () => {
        disposers.forEach((dispose) => dispose());
      };
    };

    const initMasonry = async () => {
      const Masonry = (await import('masonry-layout')).default;

      if (isCancelled || !containerRef.current) return;

      if (!masonryRef.current) {
        masonryRef.current = new Masonry(containerRef.current, {
          itemSelector: '.masonry-item',
          columnWidth: '.grid-sizer',
          gutter: 24,
          percentPosition: true,
          horizontalOrder: true,
          transitionDuration: '0s',
        });
      } else {
        masonryRef.current.reloadItems?.();
      }

      detachImageListeners?.();
      detachImageListeners = bindImageLoadHandlers(containerRef.current);

      // Delay one tick to ensure responsive width classes are applied.
      relayoutTimeoutRef.current = window.setTimeout(() => {
        scheduleLayout(true);
      }, 0);

      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = new ResizeObserver(() => {
        scheduleLayout();
      });
      resizeObserverRef.current.observe(containerRef.current);

      mutationObserverRef.current?.disconnect();
      mutationObserverRef.current = new MutationObserver(() => {
        if (!containerRef.current) return;
        detachImageListeners?.();
        detachImageListeners = bindImageLoadHandlers(containerRef.current);
        scheduleLayout(true);
      });
      mutationObserverRef.current.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset', 'sizes'],
      });
    };

    initMasonry();

    return () => {
      isCancelled = true;
      clearRelayoutTimers();
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      mutationObserverRef.current?.disconnect();
      mutationObserverRef.current = null;
      detachImageListeners?.();
      detachImageListeners = null;
      masonryRef.current?.destroy?.();
      masonryRef.current = null;
    };
  }, [data.images, columns]);

  return (
    <div className='max-w-[968px] mx-auto px-6 image-gallery-block [&+.image-gallery-block]:!mt-0'>
      <div ref={containerRef} className="w-full relative">
        {/* Sizer element for Masonry */}
        <div className={`grid-sizer ${itemWidthClass} absolute invisible`} />

        {data.images?.map((img, imgIndex: number) => {
          const altText = lang === 'vi' ? img.alt_vi : img.alt_en;
          const globalIndex = indexMap[`${blockIndex}-${imgIndex}`];
          return (
            <button
              key={`${img.src}-${imgIndex}`}
              type='button'
              className={`masonry-item ${itemWidthClass} cursor-pointer hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary block mb-6`}
              onClick={() => onImageClick(globalIndex)}
              aria-label={altText || 'View image in gallery'}
            >
              <MerakiImage
                src={img.src}
                alt={altText || ''}
                className='w-full h-auto block'
                data-tina-field={tinaField(img, 'src')}
                thumborWidth={480}
                width={img.width}
                height={img.height}
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
