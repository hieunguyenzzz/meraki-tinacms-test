import type { Collection } from 'tinacms';

export const Page: Collection = {
  label: 'Page Content',
  name: 'page',
  path: 'content/page',
  format: 'mdx',
  ui: {
    router: ({ document }) => {
      if (document._sys.filename === 'index') {
        return '/';
      }
      return undefined;
    },
  },
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
          name: 'gallery',
          label: 'Homepage Image Ribbon',
          list: true,
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
      name: 'services_section',
      label: 'Services Section (Homepage Only)',
      description: 'This section is only used on homepage',
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
        {
          type: 'object',
          name: 'items',
          label: 'Services',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.title_en || 'Service',
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
              type: 'image',
              name: 'image',
              label: 'Image',
            },
            {
              type: 'string',
              name: 'link',
              label: 'Link',
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      name: 'introduction',
      label: 'Homepage Introduction',
      fields: [
        {
          type: 'rich-text',
          name: 'text_en',
          label: 'Text (English)',
          toolbarOverride: ['italic'],
        },
        {
          type: 'rich-text',
          name: 'text_vi',
          label: 'Text (Vietnamese)',
          toolbarOverride: ['italic'],
        },
      ],
    },
    {
      type: 'object',
      name: 'featured_journals',
      label: 'Homepage Featured Journals',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.headline_en || item?.couple_names || 'Journal',
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'headline_en',
          label: 'Headline (English)',
        },
        {
          type: 'string',
          name: 'headline_vi',
          label: 'Headline (Vietnamese)',
        },
        {
          type: 'string',
          name: 'couple_names',
          label: 'Couple Names',
        },
        {
          type: 'string',
          name: 'slug',
          label: 'Journal Slug',
        },
        {
          type: 'image',
          name: 'image',
          label: 'Image',
        },
      ],
    },
    {
      type: 'object',
      name: 'love_notes_section',
      label: 'Homepage Love Notes',
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
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'description_vi',
          label: 'Description (Vietnamese)',
          ui: { component: 'textarea' },
        },
        {
          type: 'image',
          name: 'image',
          label: 'Couple Image',
        },
        {
          type: 'string',
          name: 'couple_names_en',
          label: 'Couple Names (English)',
        },
        {
          type: 'string',
          name: 'couple_names_vi',
          label: 'Couple Names (Vietnamese)',
        },
        {
          type: 'string',
          name: 'wedding_location_en',
          label: 'Wedding Location (English)',
        },
        {
          type: 'string',
          name: 'wedding_location_vi',
          label: 'Wedding Location (Vietnamese)',
        },
        {
          type: 'string',
          name: 'excerpt_en',
          label: 'Excerpt (English)',
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'excerpt_vi',
          label: 'Excerpt (Vietnamese)',
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'note_en',
          label: 'Note (English)',
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'note_vi',
          label: 'Note (Vietnamese)',
          ui: { component: 'textarea' },
        },
      ],
    },
    {
      type: 'object',
      name: 'team_section',
      label: 'Homepage Team',
      fields: [
        {
          type: 'rich-text',
          name: 'text_en',
          label: 'Text (English)',
          toolbarOverride: ['italic'],
        },
        {
          type: 'rich-text',
          name: 'text_vi',
          label: 'Text (Vietnamese)',
          toolbarOverride: ['italic'],
        },
        {
          type: 'image',
          name: 'image',
          label: 'Team Image',
        },
      ],
    },
    {
      type: 'object',
      name: 'connect_section',
      label: 'Homepage Contact Callout',
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
          ui: { component: 'textarea' },
        },
        {
          type: 'string',
          name: 'description_vi',
          label: 'Description (Vietnamese)',
          ui: { component: 'textarea' },
        },
      ],
    },
    {
      type: 'object',
      name: 'instagram_section',
      label: 'Homepage Instagram',
      fields: [
        {
          type: 'string',
          name: 'title',
          label: 'Title',
        },
        {
          type: 'object',
          name: 'images',
          label: 'Images',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.link || 'Instagram Image',
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
              name: 'link',
              label: 'Link (Optional)',
              description: 'Instagram post or any destination URL',
            },
          ],
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
