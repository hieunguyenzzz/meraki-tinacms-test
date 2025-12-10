#!/usr/bin/env node

/**
 * Image Migration Script: Local to AWS S3
 *
 * This script migrates all images from public/images/ to AWS S3 bucket.
 * It preserves the directory structure and sets appropriate content types.
 *
 * Usage: node scripts/migrate-images-to-s3.js [--dry-run]
 *
 * Environment variables required:
 * - S3_REGION
 * - S3_BUCKET
 * - S3_ACCESS_KEY
 * - S3_SECRET_KEY
 */

require('dotenv').config()

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')

// Configuration
const SOURCE_DIR = path.join(process.cwd(), 'public', 'images')
const DRY_RUN = process.argv.includes('--dry-run')
const SKIP_EXISTING = process.argv.includes('--skip-existing')

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
})

const BUCKET = process.env.S3_BUCKET

// Content type mapping
const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.avif': 'image/avif',
}

// Statistics
const stats = {
  total: 0,
  uploaded: 0,
  skipped: 0,
  errors: 0,
}

/**
 * Get all image files recursively from a directory
 */
function getImageFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    console.error(`Directory not found: ${dir}`)
    return fileList
  }

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getImageFiles(filePath, fileList)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (CONTENT_TYPES[ext]) {
        fileList.push(filePath)
      }
    }
  }

  return fileList
}

/**
 * Check if object exists in S3
 */
async function objectExists(key) {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }))
    return true
  } catch (error) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false
    }
    throw error
  }
}

/**
 * Upload a single file to S3
 */
async function uploadFile(localPath) {
  // Calculate S3 key (relative path from public/images/)
  const relativePath = path.relative(SOURCE_DIR, localPath)
  const s3Key = relativePath.replace(/\\/g, '/') // Normalize path separators

  const ext = path.extname(localPath).toLowerCase()
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream'

  stats.total++

  // Check if file already exists in S3
  if (SKIP_EXISTING) {
    try {
      const exists = await objectExists(s3Key)
      if (exists) {
        console.log(`  [SKIP] ${s3Key} (already exists)`)
        stats.skipped++
        return { skipped: true, key: s3Key }
      }
    } catch (error) {
      // Continue with upload if check fails
    }
  }

  if (DRY_RUN) {
    console.log(`  [DRY-RUN] Would upload: ${localPath} -> s3://${BUCKET}/${s3Key}`)
    return { dryRun: true, key: s3Key }
  }

  try {
    const fileContent = fs.readFileSync(localPath)

    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read',
    })

    await s3Client.send(command)

    console.log(`  [OK] ${s3Key} (${contentType})`)
    stats.uploaded++

    return {
      success: true,
      key: s3Key,
      url: `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${s3Key}`,
    }
  } catch (error) {
    console.error(`  [ERROR] ${s3Key}: ${error.message}`)
    stats.errors++
    return { error: true, key: s3Key, message: error.message }
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('========================================')
  console.log('  Image Migration: Local -> AWS S3')
  console.log('========================================')
  console.log('')

  // Validate environment variables
  const requiredEnvVars = ['S3_REGION', 'S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY']
  const missingVars = requiredEnvVars.filter(v => !process.env[v])

  if (missingVars.length > 0) {
    console.error('Missing required environment variables:')
    missingVars.forEach(v => console.error(`  - ${v}`))
    console.error('\nPlease set these in your .env file')
    process.exit(1)
  }

  console.log(`Source: ${SOURCE_DIR}`)
  console.log(`Target: s3://${BUCKET}`)
  console.log(`Region: ${process.env.S3_REGION}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`)
  console.log(`Skip existing: ${SKIP_EXISTING ? 'Yes' : 'No'}`)
  console.log('')

  // Get all image files
  const files = getImageFiles(SOURCE_DIR)

  if (files.length === 0) {
    console.log('No image files found to migrate.')
    return
  }

  console.log(`Found ${files.length} image(s) to process`)
  console.log('')
  console.log('Processing files:')
  console.log('------------------')

  // Upload files
  const results = []
  for (const file of files) {
    const result = await uploadFile(file)
    results.push(result)
  }

  // Print summary
  console.log('')
  console.log('========================================')
  console.log('  Migration Summary')
  console.log('========================================')
  console.log(`  Total files:   ${stats.total}`)
  console.log(`  Uploaded:      ${stats.uploaded}`)
  console.log(`  Skipped:       ${stats.skipped}`)
  console.log(`  Errors:        ${stats.errors}`)
  console.log('')

  if (DRY_RUN) {
    console.log('This was a dry run. No files were uploaded.')
    console.log('Run without --dry-run to perform actual migration.')
  } else if (stats.uploaded > 0) {
    console.log('Migration complete!')
    console.log('')
    console.log('Your images are now available at:')
    console.log(`  https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/<path>`)
    console.log('')
    console.log('Next steps:')
    console.log('  1. Run: node scripts/update-image-urls.js --dry-run')
    console.log('  2. Review the changes, then run without --dry-run')
  }
}

// Run migration
migrate().catch(error => {
  console.error('Migration failed:', error)
  process.exit(1)
})
