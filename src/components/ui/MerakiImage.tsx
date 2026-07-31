'use client';

import {
  resolveImageUrl,
  getThumborUrl,
  type ThumborFitMode,
} from '@/lib/image';

const THUMBOR_HOST = 'thumbor.merakiweddingplanner.com';
const MAX_THUMBOR_WIDTH = 2000;
// Include small candidates so card, carousel, and overlay thumbnails do not
// fall back to a 400px image when they are rendered at roughly 100–300px.
const RESPONSIVE_WIDTHS = [
  96, 160, 240, 320, 480, 640, 800, 960, 1200, 1600, 2000,
];

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

function getResponsiveWidths(targetWidth?: number): number[] {
  const maximumWidth = targetWidth
    ? Math.min(MAX_THUMBOR_WIDTH, targetWidth * 2)
    : MAX_THUMBOR_WIDTH;
  const exactWidths = targetWidth
    ? [targetWidth, Math.round(targetWidth * 1.5), targetWidth * 2]
    : [];

  return Array.from(
    new Set(
      [...RESPONSIVE_WIDTHS, ...exactWidths].filter(
        (width) => width <= maximumWidth
      )
    )
  ).sort((a, b) => a - b);
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
      // Include smaller responsive candidates because many nominally fixed
      // images become fluid at narrower breakpoints.
      const widths = getResponsiveWidths(effectiveWidth);
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
      // Fill mode covers everything from small cards to full-width heroes.
      displaySrc = getThumborUrl(
        getThumborSize(800, width, height),
        resolvedSrc,
        thumborFitMode
      );
      srcSet = buildSrcSet(
        resolvedSrc,
        RESPONSIVE_WIDTHS,
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
