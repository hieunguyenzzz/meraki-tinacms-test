import {
  mediaHandlerConfig,
  createMediaHandler,
} from 'next-tinacms-s3/dist/handlers';
import { isAuthorized } from '@tinacms/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export const config = mediaHandlerConfig;

export default createMediaHandler({
  config: {
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
    region: process.env.S3_REGION,
  },
  bucket: process.env.S3_BUCKET || '',
  authorized: async (req: NextApiRequest, _res: NextApiResponse) => {
    // Always allow in development
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    // In production, verify TinaCloud authentication
    try {
      const user = await isAuthorized(req);
      return user && user.verified;
    } catch (e) {
      console.error('S3 authorization error:', e);
      return false;
    }
  },
});
