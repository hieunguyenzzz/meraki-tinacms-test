import { Collection } from "tinacms";

export const Journal: Collection = {
  name: 'journal',
  label: 'Journal',
  path: 'content/journal',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      return `/en/journal/${document._sys.filename}`;
    },
  },
  fields: [
    // Basic Info
    {
      type: 'string',
      name: 'couple_names',
      label: 'Couple Names',
      required: true,
    },
    {
      type: 'string',
      name: 'slug',
      label: 'URL Slug',
      required: true,
    },

    // Location Tag
    {
      type: 'string',
      name: 'location',
      label: 'Location',
      required: true,
      options: [
        'Tà Năng',
        'Đà Lạt',
        'Quảng Ninh',
        'Nha Trang',
        'Phú Quốc',
        'Hà Nội',
        'Sapa',
      ],
    },

    // Featured Image for Listing
    {
      type: 'image',
      name: 'featured_image',
      label: 'Featured Image (for listing page)',
      required: true,
    },

    // Template Layout Fields
    {
      type: 'object',
      name: 'template_layout',
      label: 'Main layout',
      fields: [
        // Top left detail image (e.g., bouquet)
        {
          type: 'image',
          name: 'image_top',
          label: 'Top image',
          description: 'Small image on top left corner',
        },
        // Main headline
        {
          type: 'string',
          name: 'main_headline_en',
          label: 'Main Headline (English)',
        },
        {
          type: 'string',
          name: 'main_headline_vi',
          label: 'Main Headline (Vietnamese)',
        },
        // Ceremony/group photo (middle)
        {
          type: 'image',
          name: 'image_sub',
          label: 'Sub image',
          description: 'Small image on bottom left corner',
        },
        // Large portrait photo (right side)
        {
          type: 'image',
          name: 'image_main',
          label: 'Main image',
          description: 'Main image on the right side',
        },
      ],
    },

    // Wedding Details (shown on left side)
    {
      type: 'object',
      name: 'wedding_details',
      label: 'Wedding Details',
      fields: [
        {
          type: 'string',
          name: 'nationality',
          label: 'Nationality',
          description: "e.g., 'Vietnamese - Vietnamese'",
        },
        {
          type: 'string',
          name: 'location',
          label: 'Wedding Location',
          description: "e.g., 'Quang Ninh'",
        },
        {
          type: 'string',
          name: 'venue',
          label: 'Venue',
          description: "e.g., 'Legacy Yên Tử McAllery'",
        },
      ],
    },

    // Flexible Content Blocks
    {
      type: 'object',
      name: 'content_blocks',
      label: 'Content Blocks',
      list: true,
      templates: [
        // 1 Large Image
        {
          name: 'largeImage',
          label: '1 Large Image',
          ui: {
            itemProps: (item) => ({
              label: item?.caption_en || '1 Large Image',
            }),
          },
          fields: [
            {
              type: 'image',
              name: 'image',
              label: 'Image',
            },
            {
              type: 'string',
              name: 'caption_en',
              label: 'Caption (English)',
            },
            {
              type: 'string',
              name: 'caption_vi',
              label: 'Caption (Vietnamese)',
            },
          ],
        },
        // 2 Images Side by Side
        {
          name: 'twoImagesSideBySide',
          label: '2 Images Side by Side',
          ui: {
            itemProps: () => ({
              label: '2 Images Side by Side',
            }),
          },
          fields: [
            {
              type: 'image',
              name: 'image_left',
              label: 'Left Image',
            },
            {
              type: 'image',
              name: 'image_right',
              label: 'Right Image',
            },
            {
              type: 'string',
              name: 'caption_en',
              label: 'Caption (English)',
            },
            {
              type: 'string',
              name: 'caption_vi',
              label: 'Caption (Vietnamese)',
            },
          ],
        },
        // 2 Images Asymmetry
        {
          name: 'twoImagesAsymmetry',
          label: '2 Images Asymmetry',
          ui: {
            itemProps: () => ({
              label: '2 Images Asymmetry',
            }),
          },
          fields: [
            {
              type: 'image',
              name: 'image_large',
              label: 'Large Image',
            },
            {
              type: 'image',
              name: 'image_small',
              label: 'Small Image',
            },
            {
              type: 'string',
              name: 'layout',
              label: 'Layout',
              options: [
                { value: 'large-left', label: 'Large Left, Small Right' },
                { value: 'large-right', label: 'Large Right, Small Left' },
              ],
            },
            {
              type: 'string',
              name: 'caption_en',
              label: 'Caption (English)',
            },
            {
              type: 'string',
              name: 'caption_vi',
              label: 'Caption (Vietnamese)',
            },
          ],
        },
        // 3 Images
        {
          name: 'threeImages',
          label: '3 Images',
          ui: {
            itemProps: () => ({
              label: '3 Images',
            }),
          },
          fields: [
            {
              type: 'image',
              name: 'image_1',
              label: 'Image 1',
            },
            {
              type: 'image',
              name: 'image_2',
              label: 'Image 2',
            },
            {
              type: 'image',
              name: 'image_3',
              label: 'Image 3',
            },
            {
              type: 'string',
              name: 'layout',
              label: 'Layout',
              options: [
                { value: 'row', label: 'Row (3 equal columns)' },
                { value: 'featured-left', label: 'Featured Left (1 large + 2 stacked)' },
                { value: 'featured-right', label: 'Featured Right (2 stacked + 1 large)' },
              ],
            },
            {
              type: 'string',
              name: 'caption_en',
              label: 'Caption (English)',
            },
            {
              type: 'string',
              name: 'caption_vi',
              label: 'Caption (Vietnamese)',
            },
          ],
        },
        // Masonry Gallery (flexible number of images)
        {
          name: 'masonryGallery',
          label: 'Masonry Gallery',
          ui: {
            itemProps: (item) => ({
              label: `Masonry Gallery (${item?.images?.length || 0} images)`,
            }),
          },
          fields: [
            {
              type: 'object',
              name: 'images',
              label: 'Images',
              list: true,
              ui: {
                itemProps: (item) => ({
                  label: item?.alt_en || 'Image',
                }),
              },
              fields: [
                {
                  type: 'image',
                  name: 'src',
                  label: 'Image',
                },
                {
                  type: 'string',
                  name: 'alt_en',
                  label: 'Alt Text (English)',
                },
                {
                  type: 'string',
                  name: 'alt_vi',
                  label: 'Alt Text (Vietnamese)',
                },
              ],
            },
            {
              type: 'string',
              name: 'columns',
              label: 'Columns',
              options: [
                { value: '2', label: '2 Columns' },
                { value: '3', label: '3 Columns' },
                { value: '4', label: '4 Columns' },
              ],
            },
            {
              type: 'string',
              name: 'caption_en',
              label: 'Caption (English)',
            },
            {
              type: 'string',
              name: 'caption_vi',
              label: 'Caption (Vietnamese)',
            },
          ],
        },
        // Text Block
        {
          name: 'textBlock',
          label: 'Text Block',
          ui: {
            itemProps: (item) => ({
              label: item?.title_en || 'Text Block',
            }),
          },
          fields: [
            {
              type: 'string',
              name: 'title_en',
              label: 'Title (English)',
            },
            {
              type: 'string',
              name: 'title_vi',
              label: 'Title (Vietnamese)',
            },
            {
              type: 'string',
              name: 'description_en',
              label: 'Description (English)',
              ui: {
                component: 'textarea',
              },
            },
            {
              type: 'string',
              name: 'description_vi',
              label: 'Description (Vietnamese)',
              ui: {
                component: 'textarea',
              },
            },
            {
              type: 'string',
              name: 'alignment',
              label: 'Text Alignment',
              options: [
                { value: 'left', label: 'Left' },
                { value: 'center', label: 'Center' },
                { value: 'right', label: 'Right' },
              ],
            },
          ],
        },
      ],
    },

    // Testimonial Section
    {
      type: 'object',
      name: 'testimonial',
      label: 'Testimonial Section',
      fields: [
        {
          type: 'string',
          name: 'heading',
          label: 'Testimonial Heading',
          description: "e.g., 'Testimonial'",
        },
        {
          type: 'string',
          name: 'decorative_text',
          label: 'Decorative Text',
          description:
            'Decorative script text above quote (e.g., cursive text)',
        },
        {
          type: 'string',
          name: 'quote_en',
          label: 'Quote (English)',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'string',
          name: 'quote_vi',
          label: 'Quote (Vietnamese)',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'string',
          name: 'author',
          label: 'Quote Author',
        },
      ],
    },

    // SEO Fields
    {
      type: 'object',
      name: 'seo_en',
      label: 'SEO (English)',
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Meta Title',
        },
        {
          type: 'string',
          name: 'description',
          label: 'Meta Description',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },
    {
      type: 'object',
      name: 'seo_vi',
      label: 'SEO (Vietnamese)',
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Meta Title',
        },
        {
          type: 'string',
          name: 'description',
          label: 'Meta Description',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },

    // Publishing
    {
      type: 'boolean',
      name: 'published',
      label: 'Published',
      required: true,
    },
  ],
};