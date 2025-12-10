import type { Media, MediaList, MediaListOptions, MediaStore, MediaUploadOptions } from 'tinacms'

const S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET || ''
const S3_REGION = process.env.NEXT_PUBLIC_S3_REGION || 'ap-southeast-1'
const S3_BASE_URL = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com`

export class S3MediaStore implements MediaStore {
  accept = '*'

  async persist(files: MediaUploadOptions[]): Promise<Media[]> {
    const uploadedFiles: Media[] = []

    for (const { file, directory } of files) {
      // Get presigned URL for upload
      const response = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          directory: directory?.replace(/^\//, '') || '',
          contentType: file.type,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get upload URL: ${response.statusText}`)
      }

      const { signedUrl, src } = await response.json()

      // Upload file directly to S3
      const uploadResponse = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.statusText}`)
      }

      uploadedFiles.push({
        id: src,
        type: 'file',
        directory: directory || '/',
        filename: file.name,
        src,
      })
    }

    return uploadedFiles
  }

  async delete(media: Media): Promise<void> {
    // Extract the key from the src URL
    const key = media.id?.replace(`${S3_BASE_URL}/`, '') ||
                media.src?.replace(`${S3_BASE_URL}/`, '') ||
                `${media.directory}/${media.filename}`.replace(/^\//, '')

    const response = await fetch('/api/s3/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    })

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`)
    }
  }

  async list(options?: MediaListOptions): Promise<MediaList> {
    const directory = options?.directory?.replace(/^\//, '') || ''
    const limit = options?.limit || 500
    const offset = options?.offset ? String(options.offset) : ''

    const params = new URLSearchParams()
    params.set('directory', directory)
    params.set('limit', String(limit))
    if (offset) {
      params.set('offset', offset)
    }

    const response = await fetch(`/api/s3/list?${params}`)

    if (!response.ok) {
      throw new Error(`Failed to list media: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      items: data.items.map((item: {
        id: string
        filename: string
        directory: string
        src?: string
        type: string
        size?: number
      }) => ({
        id: item.id,
        type: item.type,
        directory: item.directory || '/',
        filename: item.filename,
        src: item.src,
      })),
      nextOffset: data.offset || undefined,
    }
  }

  // Required for previewSrc
  previewSrc(src: string): string {
    return src
  }
}

export default S3MediaStore
