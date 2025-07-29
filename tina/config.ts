import { defineConfig } from "tinacms";
import { Page } from "./collections/page";
import { Journal } from "./collections/journal";
import { Testimonial } from "./collections/testimonial";
import { Blog } from "./collections/blog";

export const config = defineConfig({
  contentApiUrlOverride: '/api/tina/gql',
  clientId: process.env.TINA_PUBLIC_IS_LOCAL === 'true' ? null : process.env.TINA_CLIENT_ID,
  branch:
    process.env.TINA_BRANCH || // custom branch env override
    process.env.VERCEL_GIT_COMMIT_REF || // Vercel branch env
    process.env.HEAD || // Netlify branch env
    "main", // fallback
  token: process.env.TINA_PUBLIC_IS_LOCAL === 'true' ? null : process.env.TINA_TOKEN,
  media: {
    // If you wanted cloudinary do this
    // loadCustomStore: async () => {
    //   const pack = await import("next-tinacms-cloudinary");
    //   return pack.TinaCloudCloudinaryMediaStore;
    // },
    // this is the config for the tina cloud media store
    tina: {
      publicFolder: "public",
      mediaRoot: "",
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [Page, Journal, Testimonial, Blog],
  },
});

export default config;
