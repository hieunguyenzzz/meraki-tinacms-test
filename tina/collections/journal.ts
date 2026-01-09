import { Collection } from "tinacms";
import { CustomImageField } from "../fields/CustomImageField";
import { spacingBlock } from "../templates/spacing";
import { imageGalleryBlock } from "../templates/ImageGallery";
import { textBlock } from "../templates/text";
import { textImageBlock } from "../templates/textImage";
import { twoImagesAsymmetryBlock } from "../templates/twoImagesAsymmetry";
import { testimonialBlock } from "../templates/testimonial";
import { JOURNAL_LOCATIONS } from "../constants";

export const Journal: Collection = {
  name: "journal",
  label: "Journal",
  path: "content/journal",
  format: "mdx",
  ui: {
    router: ({ document }) => {
      return `/en/journal/${document._sys.filename}`;
    },
  },
  fields: [
    // Basic Info
    {
      type: "string",
      name: "couple_names",
      label: "Couple Names",
      required: true,
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true,
    },

    // Location Tag
    {
      type: "string",
      name: "location",
      label: "Location",
      required: true,
      options: JOURNAL_LOCATIONS,
    },

    // Priority for Sorting
    {
      type: "number",
      name: "priority",
      label: "Priority Order",
      description: "Optional. Lower number = Higher priority (1 is highest, then 10, 20...). Leave empty to sort by date.",
    },

    // Featured Image for Listing
    {
      type: "image",
      name: "featured_image",
      label: "Featured Image (for listing page)",
      required: true,
      ui: {
        component: CustomImageField,
      },
    },

    // Template Layout Fields
    {
      type: "object",
      name: "template_layout",
      label: "Main layout",
      fields: [
        // Top left detail image (e.g., bouquet)
        {
          type: "image",
          name: "image_top",
          label: "Top image",
          description: "Small image on top left corner",
          ui: {
            component: CustomImageField,
          },
        },
        // Main headline
        {
          type: "string",
          name: "main_headline_en",
          label: "Main Headline (English)",
        },
        {
          type: "string",
          name: "main_headline_vi",
          label: "Main Headline (Vietnamese)",
        },
        // Ceremony/group photo (middle)
        {
          type: "image",
          name: "image_sub",
          label: "Sub image",
          description: "Small image on bottom left corner",
          ui: {
            component: CustomImageField,
          },
        },
        // Large portrait photo (right side)
        {
          type: "image",
          name: "image_main",
          label: "Main image",
          description: "Main image on the right side",
          ui: {
            component: CustomImageField,
          },
        },
      ],
    },

    // Wedding Details (shown on left side)
    {
      type: "object",
      name: "wedding_details",
      label: "Wedding Details",
      fields: [
        {
          type: "string",
          name: "nationality",
          label: "Nationality",
          description: "e.g., 'Vietnamese - Vietnamese'",
        },
        {
          type: "string",
          name: "location",
          label: "Wedding Location",
          description: "e.g., 'Quang Ninh'",
        },
        {
          type: "string",
          name: "venue",
          label: "Venue",
          description: "e.g., 'Legacy Yên Tử McAllery'",
        },
      ],
    },

    // Flexible Content Blocks
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

    // // SEO Fields
    // {
    //   type: "object",
    //   name: "seo_en",
    //   label: "SEO (English)",
    //   fields: [
    //     {
    //       type: "string",
    //       name: "title",
    //       label: "Meta Title",
    //     },
    //     {
    //       type: "string",
    //       name: "description",
    //       label: "Meta Description",
    //       ui: {
    //         component: "textarea",
    //       },
    //     },
    //   ],
    // },
    // {
    //   type: "object",
    //   name: "seo_vi",
    //   label: "SEO (Vietnamese)",
    //   fields: [
    //     {
    //       type: "string",
    //       name: "title",
    //       label: "Meta Title",
    //     },
    //     {
    //       type: "string",
    //       name: "description",
    //       label: "Meta Description",
    //       ui: {
    //         component: "textarea",
    //       },
    //     },
    //   ],
    // },

    // Publishing
    {
      type: "boolean",
      name: "published",
      label: "Published",
      required: true,
    },
  ],
};
