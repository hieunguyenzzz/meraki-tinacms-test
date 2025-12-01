import { defineConfig } from "tinacms";
import { Page } from "./collections/page";
import { Journal } from "./collections/journal";
import { Testimonial } from "./collections/testimonial";
import { Blog } from "./collections/blog";

// Determine if running in local mode or TinaCMS Cloud mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export const config = defineConfig({
  // TinaCMS Cloud configuration
  clientId: process.env.TINA_CLIENT_ID || null,
  token: process.env.TINA_TOKEN || null,
  branch: process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main',
  
  // Media storage configuration
  media: {
    tina: {
      publicFolder: 'public',
      mediaRoot: 'images',
    },
  },
  
  build: {
    publicFolder: 'public',
    outputFolder: 'admin',
  },
  
  schema: {
    collections: [Page, Journal, Testimonial, Blog],
  },

  // Search configuration (optional - only enable if TINA_SEARCH_TOKEN is set)
  ...(process.env.TINA_SEARCH_TOKEN ? {
    search: {
      tina: {
        indexerToken: process.env.TINA_SEARCH_TOKEN,
        stopwordLanguages: ['eng', 'vie'],
      },
    },
  } : {}),
});

export default config;
