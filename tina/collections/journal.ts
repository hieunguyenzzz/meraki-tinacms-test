import { Collection } from "tinacms";

export const Journal: Collection = {
  name: "journal",
  label: "Journal",
  path: "content/journal",
  format: "mdx",
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
      name: "subtitle_en",
      label: "Subtitle (English)",
      required: true,
    },
    {
      type: "string",
      name: "subtitle_vi", 
      label: "Subtitle (Vietnamese)",
      required: true,
    },
    {
      type: "string",
      name: "slug",
      label: "URL Slug",
      required: true,
    },
    
    // Hero Section
    {
      type: "object",
      name: "hero",
      label: "Hero Section",
      fields: [
        {
          type: "image",
          name: "image",
          label: "Hero Image",
        },
        {
          type: "string",
          name: "alt_en",
          label: "Alt Text (English)",
        },
        {
          type: "string",
          name: "alt_vi",
          label: "Alt Text (Vietnamese)",
        },
      ],
    },

    // Wedding Details
    {
      type: "object",
      name: "wedding_details",
      label: "Wedding Details",
      fields: [
        {
          type: "string",
          name: "nationality",
          label: "Nationality",
        },
        {
          type: "string",
          name: "guest_count",
          label: "Guest Count",
        },
        {
          type: "string",
          name: "wedding_type_en",
          label: "Wedding Type (English)",
        },
        {
          type: "string",
          name: "wedding_type_vi",
          label: "Wedding Type (Vietnamese)",
        },
        {
          type: "string",
          name: "venue",
          label: "Venue",
        },
        {
          type: "datetime",
          name: "wedding_date",
          label: "Wedding Date",
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
        // Text + Image Block (like "What We Love")
        {
          name: "text_image_block",
          label: "Text + Image Block",
          fields: [
            {
              type: "string",
              name: "heading_en",
              label: "Heading (English)",
            },
            {
              type: "string",
              name: "heading_vi",
              label: "Heading (Vietnamese)",
            },
            {
              type: "rich-text",
              name: "content_en",
              label: "Content (English)",
            },
            {
              type: "rich-text",
              name: "content_vi",
              label: "Content (Vietnamese)",
            },
            {
              type: "image",
              name: "image",
              label: "Image",
            },
            {
              type: "string",
              name: "image_alt_en",
              label: "Image Alt Text (English)",
            },
            {
              type: "string",
              name: "image_alt_vi",
              label: "Image Alt Text (Vietnamese)",
            },
            {
              type: "string",
              name: "layout",
              label: "Layout",
              options: ["image-left", "image-right", "image-top", "image-bottom"],
              ui: {
                component: "select",
              },
            },
            {
              type: "string",
              name: "background_color",
              label: "Background Color",
              options: ["white", "gray-50", "gray-100"],
              ui: {
                component: "select",
              },
            },
          ],
        },

        // Gallery Block
        {
          name: "gallery_block",
          label: "Gallery Block",
          fields: [
            {
              type: "string",
              name: "heading_en",
              label: "Heading (English)",
            },
            {
              type: "string",
              name: "heading_vi",
              label: "Heading (Vietnamese)",
            },
            {
              type: "object",
              name: "images",
              label: "Gallery Images",
              list: true,
              fields: [
                {
                  type: "image",
                  name: "image",
                  label: "Image",
                },
                {
                  type: "string",
                  name: "alt_en",
                  label: "Alt Text (English)",
                },
                {
                  type: "string",
                  name: "alt_vi",
                  label: "Alt Text (Vietnamese)",
                },
                {
                  type: "string",
                  name: "caption_en",
                  label: "Caption (English)",
                },
                {
                  type: "string",
                  name: "caption_vi",
                  label: "Caption (Vietnamese)",
                },
              ],
            },
            {
              type: "string",
              name: "gallery_style",
              label: "Gallery Style",
              options: ["grid-2", "grid-3", "grid-4", "masonry", "slideshow"],
              ui: {
                component: "select",
              },
            },
            {
              type: "string",
              name: "background_color",
              label: "Background Color",
              options: ["white", "gray-50", "gray-100"],
              ui: {
                component: "select",
              },
            },
          ],
        },

        // Large Image Block
        {
          name: "large_image_block",
          label: "Large Image Block",
          fields: [
            {
              type: "image",
              name: "image",
              label: "Image",
            },
            {
              type: "string",
              name: "alt_en",
              label: "Alt Text (English)",
            },
            {
              type: "string",
              name: "alt_vi",
              label: "Alt Text (Vietnamese)",
            },
            {
              type: "string",
              name: "caption_en",
              label: "Caption (English)",
            },
            {
              type: "string",
              name: "caption_vi",
              label: "Caption (Vietnamese)",
            },
            {
              type: "string",
              name: "size",
              label: "Image Size",
              options: ["full-width", "large", "medium"],
              ui: {
                component: "select",
              },
            },
          ],
        },

        // Text Only Block
        {
          name: "text_block",
          label: "Text Block",
          fields: [
            {
              type: "string",
              name: "heading_en",
              label: "Heading (English)",
            },
            {
              type: "string",
              name: "heading_vi",
              label: "Heading (Vietnamese)",
            },
            {
              type: "rich-text",
              name: "content_en",
              label: "Content (English)",
            },
            {
              type: "rich-text",
              name: "content_vi",
              label: "Content (Vietnamese)",
            },
            {
              type: "string",
              name: "text_align",
              label: "Text Alignment",
              options: ["left", "center", "right"],
              ui: {
                component: "select",
              },
            },
            {
              type: "string",
              name: "background_color",
              label: "Background Color", 
              options: ["white", "gray-50", "gray-100"],
              ui: {
                component: "select",
              },
            },
          ],
        },

        // Location Block (special block like "The Location")
        {
          name: "location_block",
          label: "Location Block",
          fields: [
            {
              type: "string",
              name: "heading_en",
              label: "Heading (English)",
            },
            {
              type: "string",
              name: "heading_vi",
              label: "Heading (Vietnamese)",
            },
            {
              type: "string",
              name: "location_name_en",
              label: "Location Name (English)",
            },
            {
              type: "string",
              name: "location_name_vi",
              label: "Location Name (Vietnamese)",
            },
            {
              type: "rich-text",
              name: "description_en",
              label: "Description (English)",
            },
            {
              type: "rich-text",
              name: "description_vi",
              label: "Description (Vietnamese)",
            },
            {
              type: "object",
              name: "images",
              label: "Location Images",
              list: true,
              fields: [
                {
                  type: "image",
                  name: "image",
                  label: "Image",
                },
                {
                  type: "string",
                  name: "alt_en",
                  label: "Alt Text (English)",
                },
                {
                  type: "string",
                  name: "alt_vi",
                  label: "Alt Text (Vietnamese)",
                },
              ],
            },
          ],
        },

        // Quote Block
        {
          name: "quote_block",
          label: "Quote Block",
          fields: [
            {
              type: "string",
              name: "quote_en",
              label: "Quote (English)",
              ui: {
                component: "textarea",
              },
            },
            {
              type: "string",
              name: "quote_vi",
              label: "Quote (Vietnamese)",
              ui: {
                component: "textarea",
              },
            },
            {
              type: "string",
              name: "author",
              label: "Quote Author",
            },
            {
              type: "string",
              name: "background_color",
              label: "Background Color",
              options: ["white", "gray-50", "gray-100"],
              ui: {
                component: "select",
              },
            },
          ],
        },
      ],
    },

    // SEO Fields
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

    // Publishing
    {
      type: "boolean",
      name: "published",
      label: "Published",
      required: true,
    },
  ],
};