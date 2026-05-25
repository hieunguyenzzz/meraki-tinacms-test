'use client';

import {
  resolveImageUrl,
  getThumborUrl,
  type ThumborFitMode,
} from '@/lib/image';

const THUMBOR_HOST = 'thumbor.merakiweddingplanner.com';
const MAX_THUMBOR_WIDTH = 2000;
const FILL_WIDTHS = [400, 800, 1200, 1600];

function isThumborUrl(url: string): boolean {
  return url.includes(THUMBOR_HOST);
}

function isValidDimension(value?: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function getThumborSize(
  targetWidth: number,
  originalWidth?: number,
  originalHeight?: number
): string {
  if (isValidDimension(originalWidth) && isValidDimension(originalHeight)) {
    const targetHeight = Math.max(
      1,
      Math.round((targetWidth * originalHeight) / originalWidth)
    );
    return `${targetWidth}x${targetHeight}`;
  }

  return `${targetWidth}x0`;
}

function buildSrcSet(
  src: string,
  widths: number[],
  fitMode: ThumborFitMode,
  originalWidth?: number,
  originalHeight?: number
): string {
  return widths
    .map(
      (w) =>
        `${getThumborUrl(
          getThumborSize(w, originalWidth, originalHeight),
          src,
          fitMode
        )} ${w}w`
    )
    .join(', ');
}

interface MerakiImageProps
  extends Omit<
    React.ImgHTMLAttributes<HTMLImageElement>,
    'src' | 'width' | 'height'
  > {
  src: string;
  alt: string;
  /** HTML width attribute — used for aspect ratio / layout, not Thumbor sizing. */
  width?: number;
  /** HTML height attribute — used for aspect ratio / layout. */
  height?: number;
  /** Override the Thumbor display width independently from the HTML width.
   *  When set, Thumbor URLs use this value while width/height stay for aspect ratio. */
  thumborWidth?: number;
  thumborFitMode?: ThumborFitMode;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export default function MerakiImage({
  src,
  alt,
  className,
  width,
  height,
  thumborWidth,
  thumborFitMode = 'fit-in',
  fill,
  sizes,
  priority,
  ...props
}: MerakiImageProps) {
  const resolvedSrc = resolveImageUrl(src);
  const alreadyThumbor = isThumborUrl(resolvedSrc);
  const isSvg = resolvedSrc.endsWith('.svg');

  // Determine the display src via Thumbor
  let displaySrc = resolvedSrc;
  let srcSet: string | undefined;

  // thumborWidth takes priority over width for Thumbor URL generation
  const effectiveWidth = thumborWidth ?? width;

  if (!alreadyThumbor && !isSvg) {
    if (effectiveWidth) {
      // Fixed-width image: generate srcSet at 1x, 1.5x, 2x
      const widths = [
        effectiveWidth,
        Math.round(effectiveWidth * 1.5),
        effectiveWidth * 2,
      ].filter((w) => w <= MAX_THUMBOR_WIDTH);
      displaySrc = getThumborUrl(
        getThumborSize(effectiveWidth, width, height),
        resolvedSrc,
        thumborFitMode
      );
      srcSet = buildSrcSet(
        resolvedSrc,
        widths,
        thumborFitMode,
        width,
        height
      );
    } else if (fill) {
      // Fill mode: generate srcSet at standard breakpoints
      displaySrc = getThumborUrl(
        getThumborSize(FILL_WIDTHS[2], width, height),
        resolvedSrc,
        thumborFitMode
      );
      srcSet = buildSrcSet(
        resolvedSrc,
        FILL_WIDTHS,
        thumborFitMode,
        width,
        height
      );
    } else {
      // No width, no fill: use a sensible default
      displaySrc = getThumborUrl('800x0', resolvedSrc, thumborFitMode);
    }
  }

  const defaultSizes = sizes
    ? sizes
    : effectiveWidth
      ? `${effectiveWidth}px`
      : fill
        ? '100vw'
        : undefined;

  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? ('high' as const) : undefined;

  if (fill) {
    return (
      <img
        src={displaySrc}
        srcSet={srcSet}
        sizes={defaultSizes}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          ...props.style,
        }}
        {...props}
      />
    );
  }

  return (
    <img
      src={displaySrc}
      srcSet={srcSet}
      sizes={defaultSizes}
      alt={alt}
      className={className}
      width={width || undefined}
      height={height || undefined}
      loading={loading}
      fetchPriority={fetchPriority}
      {...props}
    />
  );
}
