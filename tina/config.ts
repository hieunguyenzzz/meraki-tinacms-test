import { defineConfig } from "tinacms";
import { Page } from "./collections/page";
import { Journal } from "./collections/journal";
import { Testimonial } from "./collections/testimonial";
import { Blog } from "./collections/blog";

// Determine if running in local mode or self-hosted backend mode
const isLocal = process.env.TINA_PUBLIC_IS_LOCAL === 'true';

export const config = defineConfig({
  // Self-hosted backend configuration
  clientId: isLocal ? null : process.env.TINA_CLIENT_ID || null,
  token: isLocal ? null : process.env.TINA_TOKEN || null,
  branch: process.env.GITHUB_BRANCH || 'main',
  
  // Git provider configuration for self-hosted mode
  contentApiUrlOverride: isLocal ? undefined : '/api/tina/graphql',
  
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
  
  // Search configuration (optional, for better content search)
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ['eng', 'vie'],
    },
  },
});

export default config;
