import type { Collection } from 'tinacms';

const localizedTextFields = (label: string) => [
  {
    type: 'string' as const,
    name: `${label}_en`,
    label: `${label.replace('_', ' ')} (English)`,
    required: true,
  },
  {
    type: 'string' as const,
    name: `${label}_vi`,
    label: `${label.replace('_', ' ')} (Vietnamese)`,
    required: true,
  },
];

export const Service: Collection = {
  label: 'Service Page',
  name: 'service',
  path: 'content/service',
  format: 'mdx',
  ui: {
    router: () => '/en/service',
  },
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
        },
        {
          type: 'image',
          name: 'featured_image',
          label: 'Hero Featured Image',
        },
        ...localizedTextFields('title'),
        {
          type: 'string',
          name: 'description_en',
          label: 'Greeting (English)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'description_vi',
          label: 'Greeting (Vietnamese)',
          ui: { component: 'textarea' },
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'introduction',
      label: 'Introduction',
      fields: [
        {
          type: 'string',
          name: 'text_en',
          label: 'Text (English)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'text_vi',
          label: 'Text (Vietnamese)',
          ui: { component: 'textarea' },
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'wedding_types',
      label: 'Wedding Types',
      fields: [
        {
          type: 'object',
          name: 'destination',
          label: 'Destination Wedding Panel',
          fields: [
            {
              type: 'image',
              name: 'background_image',
              label: 'Background Image',
            },
            ...localizedTextFields('title'),
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
          name: 'city',
          label: 'City Wedding Panel',
          fields: [
            {
              type: 'image',
              name: 'background_image',
              label: 'Background Image',
            },
            ...localizedTextFields('title'),
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
      ],
    },
    {
      type: 'object',
      name: 'scope',
      label: 'Scope of Work',
      fields: [
        ...localizedTextFields('title'),
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
        {
          type: 'object',
          name: 'items',
          label: 'Scope Items',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.label_en || item?.label_vi || 'Scope item',
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
          ],
        },
      ],
    },
    {
      type: 'object',
      name: 'featured_journals',
      label: 'Featured Journals',
      description:
        'Choose three different published journal entries. Their order controls the cards on the service page.',
      fields: [
        {
          type: 'reference',
          name: 'first',
          label: 'First Journal',
          collections: ['journal'],
          required: true,
        },
        {
          type: 'reference',
          name: 'second',
          label: 'Second Journal',
          collections: ['journal'],
          required: true,
        },
        {
          type: 'reference',
          name: 'third',
          label: 'Third Journal',
          collections: ['journal'],
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'faqs',
      label: 'FAQs',
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.question_en || item?.question_vi || 'FAQ',
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'question_en',
          label: 'Question (English)',
          required: true,
        },
        {
          type: 'string',
          name: 'question_vi',
          label: 'Question (Vietnamese)',
          required: true,
        },
        {
          type: 'string',
          name: 'answer_en',
          label: 'Answer (English)',
          ui: { component: 'textarea' },
          required: true,
        },
        {
          type: 'string',
          name: 'answer_vi',
          label: 'Answer (Vietnamese)',
          ui: { component: 'textarea' },
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'lets_connect',
      label: "Let's Connect Section",
      fields: [
        ...localizedTextFields('title'),
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
        ...localizedTextFields('button_text'),
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
