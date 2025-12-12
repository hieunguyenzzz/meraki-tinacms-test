'use client';

import Image, { ImageProps } from 'next/image';
import { resolveImageUrl } from '@/lib/image';

interface MerakiImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  useNativeImg?: boolean;
}

export default function MerakiImage({
  src,
  alt,
  className,
  useNativeImg = false,
  width,
  height,
  ...props
}: MerakiImageProps) {
  const resolvedSrc = resolveImageUrl(src);

  // Fallback to native img if useNativeImg is true
  if (useNativeImg) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        {...props}
      />
    );
  }

  // If width and height are provided, use Next.js Image
  if (width && height) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        className={className}
        width={width}
        height={height}
        {...props}
      />
    );
  }

  // If fill is provided, use Next.js Image with fill
  if (props.fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        className={className}
        {...props}
      />
    );
  }

  // Fallback: If no dimensions and no fill, we can't use Next.js Image effectively for remote images
  // without causing layout shift or errors. 
  // However, since the user requested Next.js Image, we can try to use fill=true 
  // but this requires the parent to have relative positioning.
  // A safer default for "unknown dimensions" is to revert to native img 
  // but we'll log a warning in development.
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `MerakiImage: Missing width/height or fill for image: ${src}. Falling back to native img.`
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}
