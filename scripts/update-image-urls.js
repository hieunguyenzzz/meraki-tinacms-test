#!/usr/bin/env node

/**
 * Update Image URLs Script
 *
 * This script scans MDX content files and updates local image paths
 * to use AWS S3 URLs.
 *
 * Usage: node scripts/update-image-urls.js [--dry-run]
 *
 * Environment variables required:
 * - S3_REGION
 * - S3_BUCKET
 */

require('dotenv').config()

const fs = require('fs')
const path = require('path')

// Configuration
const CONTENT_DIR = path.join(process.cwd(), 'content')
const DRY_RUN = process.argv.includes('--dry-run')

// S3 URL base
const S3_BASE_URL = `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`

// Statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  urlsReplaced: 0,
}

// Patterns to match local image paths
const PATTERNS = [
  // Standard /images/ paths
  {
    regex: /\/images\/([\w\-\/\.]+\.(jpg|jpeg|png|gif|webp|svg|avif))/gi,
    replace: (match, p1) => `${S3_BASE_URL}/${p1}`,
  },
  // Relative paths like images/ (without leading slash)
  {
    regex: /(?<=['"])(images\/([\w\-\/\.]+\.(jpg|jpeg|png|gif|webp|svg|avif)))(?=['"])/gi,
    replace: (match, p1) => `${S3_BASE_URL}/${p1}`,
  },
]

/**
 * Get all content files recursively
 */
function getContentFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) {
    return fileList
  }

  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      getContentFiles(filePath, fileList)
    } else {
      const ext = path.extname(file).toLowerCase()
      if (['.mdx', '.md', '.json'].includes(ext)) {
        fileList.push(filePath)
      }
    }
  }

  return fileList
}

/**
 * Process a single file and update image URLs
 */
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  let modified = false
  let replacements = 0
  const changes = []

  for (const pattern of PATTERNS) {
    const matches = content.match(pattern.regex)
    if (matches) {
      for (const match of matches) {
        changes.push({ from: match, to: match.replace(pattern.regex, pattern.replace) })
      }
      const newContent = content.replace(pattern.regex, pattern.replace)
      if (newContent !== content) {
        replacements += matches.length
        content = newContent
        modified = true
      }
    }
  }

  stats.filesScanned++

  if (modified) {
    stats.filesModified++
    stats.urlsReplaced += replacements

    const relativePath = path.relative(process.cwd(), filePath)

    if (DRY_RUN) {
      console.log(`\n[DRY-RUN] Would modify: ${relativePath}`)
      console.log(`  ${replacements} URL(s) to update:`)
      changes.forEach(c => {
        console.log(`    - ${c.from}`)
        console.log(`      -> ${c.to}`)
      })
    } else {
      fs.writeFileSync(filePath, content, 'utf-8')
      console.log(`\n[UPDATED] ${relativePath}`)
      console.log(`  ${replacements} URL(s) updated:`)
      changes.forEach(c => {
        console.log(`    - ${c.from}`)
        console.log(`      -> ${c.to}`)
      })
    }
  }

  return { modified, replacements, changes }
}

/**
 * Main function
 */
async function main() {
  console.log('========================================')
  console.log('  Update Image URLs: Local -> S3')
  console.log('========================================')
  console.log('')

  // Validate environment variables
  if (!process.env.S3_BUCKET || !process.env.S3_REGION) {
    console.error('Missing required environment variables: S3_BUCKET, S3_REGION')
    process.exit(1)
  }

  console.log(`Content directory: ${CONTENT_DIR}`)
  console.log(`S3 base URL: ${S3_BASE_URL}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE'}`)
  console.log('')

  // Get all content files
  const files = getContentFiles(CONTENT_DIR)

  if (files.length === 0) {
    console.log('No content files found.')
    return
  }

  console.log(`Found ${files.length} content file(s) to scan`)
  console.log('')
  console.log('Scanning files...')

  // Process each file
  for (const file of files) {
    processFile(file)
  }

  // Print summary
  console.log('')
  console.log('========================================')
  console.log('  Summary')
  console.log('========================================')
  console.log(`  Files scanned:   ${stats.filesScanned}`)
  console.log(`  Files modified:  ${stats.filesModified}`)
  console.log(`  URLs replaced:   ${stats.urlsReplaced}`)
  console.log('')

  if (DRY_RUN) {
    console.log('This was a dry run. No files were modified.')
    console.log('Run without --dry-run to apply changes.')
  } else if (stats.filesModified > 0) {
    console.log('URL update complete!')
    console.log('')
    console.log('Note: You may need to rebuild TinaCMS:')
    console.log('  yarn build')
  } else {
    console.log('No URLs needed updating.')
  }
}

// Run
main().catch(error => {
  console.error('Script failed:', error)
  process.exit(1)
})
