export type MediaKind = 'image' | 'video' | 'pdf' | 'file';

const IMAGE_EXTENSIONS = new Set([
  'avif',
  'bmp',
  'gif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'tif',
  'tiff',
  'webp',
]);

const VIDEO_EXTENSIONS = new Set([
  'm4v',
  'mov',
  'mp4',
  'mpeg',
  'mpg',
  'ogv',
  'webm',
]);

export function getMediaKind(filenameOrUrl: string): MediaKind {
  const cleanPath = filenameOrUrl.split(/[?#]/, 1)[0];
  const extension = cleanPath.split('.').pop()?.toLowerCase();

  if (!extension) return 'file';
  if (IMAGE_EXTENSIONS.has(extension)) return 'image';
  if (VIDEO_EXTENSIONS.has(extension)) return 'video';
  if (extension === 'pdf') return 'pdf';

  return 'file';
}
