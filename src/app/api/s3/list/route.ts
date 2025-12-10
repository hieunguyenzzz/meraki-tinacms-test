import { NextRequest, NextResponse } from 'next/server'
import {
  S3Client,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
  },
})

const BUCKET = process.env.S3_BUCKET || ''
const S3_BASE_URL = `https://${BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com`

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const directory = searchParams.get('directory') || ''
  const limit = parseInt(searchParams.get('limit') || '500', 10)
  const offset = searchParams.get('offset') || ''

  try {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET,
      Prefix: directory ? `${directory}/` : '',
      MaxKeys: limit,
      StartAfter: offset || undefined,
      Delimiter: '/',
    })

    const response = await s3Client.send(command)

    // Files in current directory
    const files = (response.Contents || [])
      .filter((item) => item.Key && !item.Key.endsWith('/'))
      .map((item) => ({
        id: item.Key,
        filename: item.Key?.split('/').pop() || '',
        directory: directory || '/',
        src: `${S3_BASE_URL}/${item.Key}`,
        type: 'file',
        size: item.Size,
        lastModified: item.LastModified?.toISOString(),
      }))

    // Subdirectories
    const directories = (response.CommonPrefixes || []).map((prefix) => ({
      id: prefix.Prefix?.replace(/\/$/, '') || '',
      filename: prefix.Prefix?.replace(/\/$/, '').split('/').pop() || '',
      directory: directory || '/',
      type: 'dir',
    }))

    return NextResponse.json({
      items: [...directories, ...files],
      offset: response.NextContinuationToken || null,
    })
  } catch (error) {
    console.error('Error listing media:', error)
    return NextResponse.json(
      { error: 'Failed to list media' },
      { status: 500 }
    )
  }
}
