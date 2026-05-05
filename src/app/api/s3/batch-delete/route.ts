import { NextRequest, NextResponse } from 'next/server'
import {
  S3Client,
  DeleteObjectsCommand,
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
const S3_REGION = process.env.S3_REGION || 'ap-southeast-1'

const S3_BASE_URL = `https://${BUCKET}.s3.${S3_REGION}.amazonaws.com`

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { keys } = body

    if (!keys || !Array.isArray(keys) || keys.length === 0) {
      return NextResponse.json(
        { error: 'keys array is required' },
        { status: 400 }
      )
    }

    if (keys.length > 1000) {
      return NextResponse.json(
        { error: 'Cannot delete more than 1000 files at once' },
        { status: 400 }
      )
    }

    // Normalize keys: strip S3 base URL prefix if present, then URL-decode path segments
    const normalizedKeys = keys.map((key: string) => {
      const withoutBase = key.startsWith(S3_BASE_URL) ? key.replace(`${S3_BASE_URL}/`, '') : key
      // URL-decode each path segment so the S3 key matches the original object key
      return withoutBase.split('/').map((segment: string) => decodeURIComponent(segment)).join('/')
    })

    const command = new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: {
        Objects: normalizedKeys.map((key: string) => ({ Key: key })),
        Quiet: false,
      },
    })

    const result = await s3Client.send(command)

    return NextResponse.json({
      deleted: result.Deleted?.length ?? 0,
      errors: result.Errors ?? [],
    })
  } catch (error) {
    console.error('Error batch deleting files:', error)
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    )
  }
}
