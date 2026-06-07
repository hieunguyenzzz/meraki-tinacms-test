import type { Collection } from 'tinacms';

export const BlogListing: Collection = {
  label: 'Blog Listing Page',
  name: 'blogListing',
  path: 'content/blog-listing',
  format: 'mdx',
  fields: [
    {
      type: 'string',
      name: 'title_en',
      label: 'Title (English)',
      required: true,
    },
    {
      type: 'string',
      name: 'title_vi',
      label: 'Title (Vietnamese)',
      required: true,
    },
    {
      type: 'object',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        {
          type: 'string',
          name: 'title_en',
          label: 'Hero Title (English)',
        },
        {
          type: 'string',
          name: 'title_vi',
          label: 'Hero Title (Vietnamese)',
        },
        {
          type: 'string',
          name: 'subtitle_en',
          label: 'Hero Subtitle (English)',
        },
        {
          type: 'string',
          name: 'subtitle_vi',
          label: 'Hero Subtitle (Vietnamese)',
        },
        {
          type: 'image',
          name: 'background_image',
          label: 'Background Image',
        },
        {
          type: 'image',
          name: 'featured_thumbnail',
          label: 'Featured Thumbnail',
        },
        {
          type: 'string',
          name: 'description_en',
          label: 'Hero Description (English)',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'string',
          name: 'description_vi',
          label: 'Hero Description (Vietnamese)',
          ui: {
            component: 'textarea',
          },
        },
      ],
    },
    {
      type: 'object',
      name: 'category_filters',
      label: 'Category Filters',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.value,
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'value',
          label: 'Category',
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'lets_connect',
      label: "Let's Connect Section",
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
          name: 'button_text_en',
          label: 'Button Text (English)',
        },
        {
          type: 'string',
          name: 'button_text_vi',
          label: 'Button Text (Vietnamese)',
        },
        {
          type: 'string',
          name: 'button_link',
          label: 'Button Link',
        },
      ],
    },
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
  ],
};
