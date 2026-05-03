import { Collection } from "tinacms";
import { CustomImageField } from "../fields/CustomImageField";
import { spacingBlock } from "../templates/spacing";
import { imageGalleryBlock } from "../templates/ImageGallery";
import { textBlock } from "../templates/text";
import { textImageBlock } from "../templates/textImage";
import { twoImagesAsymmetryBlock } from "../templates/twoImagesAsymmetry";
import { testimonialBlock } from "../templates/testimonial";

export const Blog: Collection = {
  name: "blog",
  label: "Blog Posts",
  path: "content/blog",
  format: "mdx",
  fields: [
    {
      type: "string",
      name: "title_en",
      label: "Title (English)",
      required: true,
    },
    {
      type: "string",
      name: "title_vi",
      label: "Title (Vietnamese)",
      required: true,
    },
    {
      type: "rich-text",
      name: "content_en",
      label: "Content (English)",
      isBody: false,
    },
    {
      type: "rich-text",
      name: "content_vi",
      label: "Content (Vietnamese)",
      isBody: false,
    },
    {
      type: "rich-text",
      name: "body",
      label: "Content",
      isBody: true,
    },
    {
      type: "image",
      name: "featured_image",
      label: "Featured Image",
      ui: {
        component: CustomImageField,
      },
    },
    {
      type: "string",
      name: "excerpt_en",
      label: "Excerpt (English)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "excerpt_vi",
      label: "Excerpt (Vietnamese)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "categories",
      label: "Categories",
      list: true,
    },
    {
      type: "string",
      name: "tags",
      label: "Tags",
      list: true,
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true,
    },
    {
      type: "datetime",
      name: "published_date",
      label: "Published Date",
    },
    {
      type: "object",
      name: "seo_en",
      label: "SEO (English)",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Meta Title",
        },
        {
          type: "string",
          name: "description",
          label: "Meta Description",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
    {
      type: "object",
      name: "seo_vi",
      label: "SEO (Vietnamese)",
      fields: [
        {
          type: "string",
          name: "title",
          label: "Meta Title",
        },
        {
          type: "string",
          name: "description",
          label: "Meta Description",
          ui: {
            component: "textarea",
          },
        },
      ],
    },
    {
      type: "boolean",
      name: "published",
      label: "Published",
      required: true,
    },
    // Flexible Content Blocks (block builder, same as journal)
    {
      type: "object",
      name: "content_blocks",
      label: "Content Blocks",
      list: true,
      templates: [
        imageGalleryBlock,
        twoImagesAsymmetryBlock,
        textBlock,
        textImageBlock,
        spacingBlock,
        testimonialBlock,
      ],
    },
  ],
};