import type { Collection } from 'tinacms';

export const Footer: Collection = {
  label: 'Footer',
  name: 'footer',
  path: 'content/footer',
  format: 'mdx',
  ui: {
    global: true,
    allowedActions: {
      create: false,
      delete: false,
    },
    router: () => '/en',
  },
  fields: [
    {
      type: 'image',
      name: 'logo',
      label: 'Logo',
      required: true,
    },
    {
      type: 'string',
      name: 'logo_alt',
      label: 'Logo Alt Text',
      required: true,
    },
    {
      type: 'object',
      name: 'contact_items',
      label: 'Contact Details',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.label_en || item?.value || 'Contact detail',
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'label_en',
          label: 'Label (English)',
        },
        {
          type: 'string',
          name: 'label_vi',
          label: 'Label (Vietnamese)',
        },
        {
          type: 'string',
          name: 'value',
          label: 'Value',
          required: true,
        },
        {
          type: 'string',
          name: 'url',
          label: 'Link',
          description:
            'Optional. Use mailto:, tel:, or a complete web address.',
        },
      ],
    },
    {
      type: 'object',
      name: 'social_links',
      label: 'Social Links',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.label || item?.platform || 'Social link',
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'platform',
          label: 'Platform',
          required: true,
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
          ],
        },
        {
          type: 'string',
          name: 'label',
          label: 'Accessible Label',
          required: true,
        },
        {
          type: 'string',
          name: 'url',
          label: 'URL',
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'navigation_sections',
      label: 'Navigation Sections',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.title_en || 'Navigation section',
        }),
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
          type: 'object',
          name: 'links',
          label: 'Links',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.label_en || 'Link',
            }),
          },
          fields: [
            {
              type: 'string',
              name: 'label_en',
              label: 'Label (English)',
              required: true,
            },
            {
              type: 'string',
              name: 'label_vi',
              label: 'Label (Vietnamese)',
              required: true,
            },
            {
              type: 'string',
              name: 'url',
              label: 'URL',
              description:
                'Use {lang} for the active language, for example /{lang}/about.',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'string',
      name: 'copyright_en',
      label: 'Copyright (English)',
      description: 'Use {year} to insert the current year.',
      required: true,
    },
    {
      type: 'string',
      name: 'copyright_vi',
      label: 'Copyright (Vietnamese)',
      description: 'Use {year} to insert the current year.',
      required: true,
    },
  ],
};
