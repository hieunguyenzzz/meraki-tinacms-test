const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || 'merakiweddingplanner';
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'ap-southeast-1';
export const S3_BASE_URL = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`;

export function resolveImageUrl(src: string | null | undefined): string {
  if (!src) return '';
  
  // If it's already a full URL, return it
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // If it's a relative path, prepend S3 base URL
  // We assume all relative paths in content should point to S3 now
  if (src.startsWith('/')) {
    return `${S3_BASE_URL}${src}`;
  }

  return src;
}
