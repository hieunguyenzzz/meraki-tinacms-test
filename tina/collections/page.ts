import type { Collection } from "tinacms";

export const Page: Collection = {
  label: 'Page Content',
  name: 'page',
  path: 'content/page',
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
      type: 'rich-text',
      name: 'content_en',
      label: 'Content (English)',
      isBody: false,
    },
    {
      type: 'rich-text',
      name: 'content_vi',
      label: 'Content (Vietnamese)',
      isBody: false,
    },
    {
      type: 'string',
      name: 'page_type',
      label: 'Page Type',
      options: ['homepage', 'about', 'contact'],
      ui: {
        component: 'select',
      },
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
      ],
    },
    {
      type: 'object',
      name: 'services_section',
      label: 'Services Section',
      fields: [
        {
          type: 'string',
          name: 'title_en',
          label: 'Services Title (English)',
        },
        {
          type: 'string',
          name: 'title_vi',
          label: 'Services Title (Vietnamese)',
        },
        {
          type: 'string',
          name: 'description_en',
          label: 'Services Description (English)',
          ui: {
            component: 'textarea',
          },
        },
        {
          type: 'string',
          name: 'description_vi',
          label: 'Services Description (Vietnamese)',
          ui: {
            component: 'textarea',
          },
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
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === 'index') {
        return '/';
      }
      return undefined;
    },
  },
};
