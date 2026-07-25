/**
 * Recovery and re-hosting of WordPress post images.
 *
 * The original WordPress host no longer serves wp-content/uploads (the app
 * container and its files are gone). The images survive only in the Cloudinary
 * fetch cache behind imageproxy.hieunguyen.dev, whose origin is dead - so they
 * are copied into the project's own S3 bucket rather than hot-linked.
 *
 * WordPress often references a resized derivative (name-300x200.jpg). The proxy
 * frequently holds only the full-size original, so a failed derivative is
 * retried without the size suffix.
 */

import { HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

// No transform in the path: the proxy then returns the untouched original
// rather than a resized copy. These are the last surviving originals, and the
// existing posts reference full-resolution S3 images, so both argue for keeping
// them at native size.
const PROXY_BASE =
  'https://imageproxy.hieunguyen.dev/api/images/dfgbpib38/image/upload';

const S3_PREFIX = 'blog/wp';

const CONTENT_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

/** Strip the host so the path can be handed to the proxy. */
export const toUploadPath = (url) =>
  url.replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+/, '');

const withoutSizeSuffix = (path) =>
  path.replace(/-\d+x\d+(\.(?:jpe?g|png|webp|gif))$/i, '$1');

const extensionOf = (path) => (path.split('.').pop() || '').toLowerCase();

/** Intrinsic dimensions straight from the file header. */
export const readDimensions = (buffer) => {
  if (buffer.length > 24 && buffer.toString('ascii', 1, 4) === 'PNG') {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) {
        offset += 1;
        continue;
      }
      const marker = buffer[offset + 1];
      const isStartOfFrame =
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc;
      if (isStartOfFrame) {
        return {
          height: buffer.readUInt16BE(offset + 5),
          width: buffer.readUInt16BE(offset + 7),
        };
      }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }

  return null;
};

const fetchViaProxy = async (path) => {
  const response = await fetch(`${PROXY_BASE}/${path}`);
  if (!response.ok) {
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.length > 1000 ? buffer : null;
};

/**
 * Fetch one upload path, falling back to the full-size original when the
 * requested derivative is absent. Returns null when nothing is recoverable.
 */
export const recoverImage = async (uploadPath) => {
  const candidates = [uploadPath];
  const original = withoutSizeSuffix(uploadPath);
  if (original !== uploadPath) {
    candidates.push(original);
  }

  for (const candidate of candidates) {
    const buffer = await fetchViaProxy(candidate);
    if (buffer) {
      return { buffer, resolvedPath: candidate };
    }
  }

  return null;
};

/** blog/wp/2021/07/b-20.jpg */
export const s3KeyFor = (uploadPath) => {
  const match = uploadPath.match(
    /uploads\/(\d{4})\/(\d{2})\/(.+)$/,
  );
  if (!match) {
    return `${S3_PREFIX}/misc/${uploadPath.split('/').pop()}`;
  }
  const [, year, month, filename] = match;
  return `${S3_PREFIX}/${year}/${month}/${filename}`;
};

export const publicUrlFor = (bucket, region, key) =>
  `https://${bucket}.s3.${region}.amazonaws.com/${key
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

const existsInS3 = async (client, bucket, key) => {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound') {
      return false;
    }
    throw error;
  }
};

/**
 * Recover one image and place it in S3. Returns the new URL plus intrinsic
 * dimensions, or null when the file could not be recovered.
 */
export const rehostImage = async ({
  client,
  bucket,
  region,
  sourceUrl,
  dryRun,
}) => {
  const uploadPath = toUploadPath(sourceUrl);
  const recovered = await recoverImage(uploadPath);
  if (!recovered) {
    return null;
  }

  const { buffer, resolvedPath } = recovered;
  const key = s3KeyFor(resolvedPath);
  const dimensions = readDimensions(buffer);

  if (!dryRun && !(await existsInS3(client, bucket, key))) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: CONTENT_TYPES[extensionOf(resolvedPath)] || 'image/jpeg',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  }

  return {
    url: publicUrlFor(bucket, region, key),
    width: dimensions?.width ?? null,
    height: dimensions?.height ?? null,
    key,
    bytes: buffer.length,
    usedFallback: resolvedPath !== uploadPath,
  };
};
