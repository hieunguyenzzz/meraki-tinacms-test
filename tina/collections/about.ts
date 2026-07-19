import type { Collection } from 'tinacms';

export const About: Collection = {
  label: 'About Page',
  name: 'about',
  path: 'content/about',
  format: 'mdx',
  fields: [
    {
      type: 'object',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        {
          type: 'image',
          name: 'background_image',
          label: 'Hero Background Image',
          required: true,
        },
        {
          type: 'image',
          name: 'featured_image',
          label: 'Hero Featured Image',
          required: true,
        },
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
          type: 'string',
          name: 'brand_name',
          label: 'Brand Name',
          required: true,
        },
        {
          type: 'string',
          name: 'pronunciation',
          label: 'Pronunciation',
          required: true,
        },
        {
          type: 'string',
          name: 'description_en',
          label: 'Description (English)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'description_vi',
          label: 'Description (Vietnamese)',
          ui: { component: 'textarea' },
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'statement',
      label: 'Statement Section',
      fields: [
        {
          type: 'rich-text',
          name: 'text_en',
          label: 'Statement (English)',
          toolbarOverride: ['italic'],
          required: true,
        },
        {
          type: 'rich-text',
          name: 'text_vi',
          label: 'Statement (Vietnamese)',
          toolbarOverride: ['italic'],
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'mission',
      label: 'Mission Section',
      fields: [
        {
          type: 'string',
          name: 'paragraph_one_en',
          label: 'First Paragraph (English)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'paragraph_one_vi',
          label: 'First Paragraph (Vietnamese)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'paragraph_two_en',
          label: 'Second Paragraph (English)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'paragraph_two_vi',
          label: 'Second Paragraph (Vietnamese)',
          ui: { component: 'textarea' },
          required: true,
        },
      ],
    },
    {
      type: 'string',
      name: 'team_title_en',
      label: 'Team Title (English)',
      required: true,
    },
    {
      type: 'string',
      name: 'team_title_vi',
      label: 'Team Title (Vietnamese)',
      required: true,
    },
    {
      type: 'object',
      name: 'team_members',
      label: 'Wedding Planners',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.name_en || item?.name_vi || 'Planner',
        }),
      },
      fields: [
        {
          type: 'image',
          name: 'image',
          label: 'Portrait',
          required: true,
        },
        {
          type: 'string',
          name: 'name_en',
          label: 'Name (English)',
          required: true,
        },
        {
          type: 'string',
          name: 'name_vi',
          label: 'Name (Vietnamese)',
          required: true,
        },
        {
          type: 'string',
          name: 'role_en',
          label: 'Role (English)',
          required: true,
        },
        {
          type: 'string',
          name: 'role_vi',
          label: 'Role (Vietnamese)',
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'seo_en',
      label: 'SEO (English)',
      fields: [
        { type: 'string', name: 'title', label: 'Meta Title' },
        {
          type: 'string',
          name: 'description',
          label: 'Meta Description',
          ui: { component: 'textarea' },
        },
      ],
    },
    {
      type: 'object',
      name: 'seo_vi',
      label: 'SEO (Vietnamese)',
      fields: [
        { type: 'string', name: 'title', label: 'Meta Title' },
        {
          type: 'string',
          name: 'description',
          label: 'Meta Description',
          ui: { component: 'textarea' },
        },
      ],
    },
  ],
};
