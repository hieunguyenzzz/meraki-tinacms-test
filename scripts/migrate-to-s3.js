import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFileSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
});

const BUCKET = process.env.S3_BUCKET;
const PUBLIC_DIR = join(__dirname, '../public');

function getContentType(filePath) {
  const ext = extname(filePath).toLowerCase();
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.avif': 'image/avif',
  };
  return types[ext] || 'application/octet-stream';
}

async function uploadFile(filePath) {
  const relativePath = relative(PUBLIC_DIR, filePath);
  const key = relativePath.replace(/\\/g, '/'); // Normalize path separators for Windows

  const fileContent = readFileSync(filePath);
  const contentType = getContentType(filePath);

  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  });

  await s3Client.send(command);
  console.log(`Uploaded: ${key}`);
  return key;
}

async function main() {
  console.log('Starting S3 migration...');
  console.log(`Bucket: ${BUCKET}`);
  console.log(`Region: ${process.env.S3_REGION}`);
  console.log(`Public directory: ${PUBLIC_DIR}`);

  if (!existsSync(PUBLIC_DIR)) {
    console.error('Public directory does not exist!');
    process.exit(1);
  }

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico', 'avif'];
  const pattern = `${PUBLIC_DIR}/images/**/*.{${imageExtensions.join(',')}}`;

  const files = await glob(pattern);
  console.log(`Found ${files.length} files to upload`);

  if (files.length === 0) {
    console.log('No images found in /public/images/');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      await uploadFile(file);
      successCount++;
    } catch (error) {
      console.error(`Failed to upload ${file}:`, error.message);
      errorCount++;
    }
  }

  console.log('\nMigration complete!');
  console.log(`Success: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
}

main().catch(console.error);
