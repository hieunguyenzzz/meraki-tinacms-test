import { Collection } from "tinacms";

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
      options: [
        "Tà Năng",
        "Đà Lạt",
        "Quảng Ninh",
        "Nha Trang",
        "Phú Quốc",
        "Hà Nội",
        "Sapa",
      ],
    },

    // Featured Image for Listing
    {
      type: "image",
      name: "featured_image",
      label: "Featured Image (for listing page)",
      required: true,
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
        },
        // Large portrait photo (right side)
        {
          type: "image",
          name: "image_main",
          label: "Main image",
          description: "Main image on the right side",
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
        // Image Gallery (flexible number of images with 1-4 columns)
        {
          name: "imageGallery",
          label: "Image Gallery",
          ui: {
            itemProps: (item) => ({
              label: `Image Gallery (${item?.images?.length || 0} images, ${
                item?.columns || 1
              } col)`,
            }),
          },
          fields: [
            {
              type: "object",
              name: "images",
              label: "Images",
              list: true,
              ui: {
                itemProps: (item) => ({
                  label: item?.alt_en || "Image",
                  style: {
                    backgroundImage: `url(${item?.src})`,
                    backgroundSize: "contain",
                    height: "50px",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  },
                }),
              },
              fields: [
                {
                  type: "image",
                  name: "src",
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
            {
              type: "string",
              name: "columns",
              label: "Columns",
              options: [
                { value: "1", label: "1 Column (Full Width)" },
                { value: "2", label: "2 Columns" },
                { value: "3", label: "3 Columns" },
                { value: "4", label: "4 Columns" },
              ],
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
        // Two Images Asymmetry (offset layout)
        {
          name: "twoImagesAsymmetry",
          label: "Two Images Asymmetry",
          ui: {
            itemProps: (item) => ({
              label: `Two Images Asymmetry (${item?.offset || "none"})`,
            }),
          },
          fields: [
            {
              type: "image",
              name: "image_left",
              label: "Left Image",
            },
            {
              type: "image",
              name: "image_right",
              label: "Right Image",
            },
            {
              type: "string",
              name: "offset",
              label: "Offset Direction",
              description: "Which image should be offset vertically",
              options: [
                { value: "up", label: "Left Up / Right Down" },
                { value: "down", label: "Left Down / Right Up" },
              ],
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
        // Text Block
        {
          name: "textBlock",
          label: "Text Block",
          ui: {
            itemProps: (item) => ({
              label: item?.title_en || "Text Block",
            }),
          },
          fields: [
            {
              type: "string",
              name: "title_en",
              label: "Title (English)",
            },
            {
              type: "string",
              name: "title_vi",
              label: "Title (Vietnamese)",
            },
            {
              type: "string",
              name: "description_en",
              label: "Description (English)",
              ui: {
                component: "textarea",
              },
            },
            {
              type: "string",
              name: "description_vi",
              label: "Description (Vietnamese)",
              ui: {
                component: "textarea",
              },
            },
            {
              type: "string",
              name: "alignment",
              label: "Text Alignment",
              options: [
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ],
            },
          ],
        },
      ],
    },

    // Testimonial Section
    {
      type: "object",
      name: "testimonial",
      label: "Testimonial Section",
      fields: [
        {
          type: "string",
          name: "heading",
          label: "Testimonial Heading",
          description: "e.g., 'Testimonial'",
        },
        {
          type: "string",
          name: "decorative_text",
          label: "Decorative Text",
          description:
            "Decorative script text above quote (e.g., cursive text)",
        },
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
