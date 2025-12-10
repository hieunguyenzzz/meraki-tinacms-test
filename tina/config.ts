import { defineConfig } from "tinacms";
import { Page } from "./collections/page";
import { Journal } from "./collections/journal";
import { Testimonial } from "./collections/testimonial";
import { Blog } from "./collections/blog";

export const config = defineConfig({
  // Completely disable cloud features for local development
  clientId: null,
  token: null,
  branch: 'main',
  // AWS S3 Media Store
  media: {
    loadCustomStore: async () => {
      const pack = await import("next-tinacms-s3");
      return pack.TinaCloudS3MediaStore;
    },
  },
  build: {
    publicFolder: 'public', // The public asset folder for your framework
    outputFolder: 'admin', // within the public folder
  },
  schema: {
    collections: [Page, Journal, Testimonial, Blog],
  },
});

export default config;
