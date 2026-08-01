import { getThumborUrl, resolveImageUrl } from './image';

/**
 * Default link-preview image. Stored in S3 already cropped to Facebook's
 * 1200x630 and already JPEG, so it is served straight from the bucket.
 */
export const DEFAULT_SHARE_IMAGE = resolveImageUrl('/images/og/home.jpg');

export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;

/**
 * Crops an arbitrary source image to the share ratio. JPEG is forced because
 * Thumbor serves WebP by default and Messenger won't render a WebP og:image.
 * Falls back to the default image when a page has none of its own.
 */
export function getShareImage(src?: string | null): string {
  if (!src) return DEFAULT_SHARE_IMAGE;
  return getThumborUrl(`${SHARE_IMAGE_WIDTH}x${SHARE_IMAGE_HEIGHT}/filters:format(jpeg)`, src, '');
}
