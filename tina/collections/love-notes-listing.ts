import type { Collection } from 'tinacms';

export const LoveNotesListing: Collection = {
  label: 'Love Notes Page',
  name: 'loveNotesListing',
  path: 'content/love-notes-listing',
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
      name: 'love_notes',
      label: 'Couples Notes',
      list: true,
      ui: {
        itemProps: (item) => ({
          label:
            item?.couple_names_en || item?.couple_names_vi || 'Couple Note',
        }),
      },
      fields: [
        {
          type: 'string',
          name: 'couple_names_en',
          label: 'Couple Names (English)',
          required: true,
        },
        {
          type: 'string',
          name: 'couple_names_vi',
          label: 'Couple Names (Vietnamese)',
          required: true,
        },
        {
          type: 'string',
          name: 'wedding_location_en',
          label: 'Wedding Location (English)',
          required: true,
        },
        {
          type: 'string',
          name: 'wedding_location_vi',
          label: 'Wedding Location (Vietnamese)',
          required: true,
        },
        {
          type: 'image',
          name: 'image',
          label: 'Couple Image',
          required: true,
        },
        {
          type: 'string',
          name: 'excerpt_en',
          label: 'Excerpt (English)',
          ui: {
            component: 'textarea',
          },
          required: true,
        },
        {
          type: 'string',
          name: 'excerpt_vi',
          label: 'Excerpt (Vietnamese)',
          ui: {
            component: 'textarea',
          },
          required: true,
        },
        {
          type: 'string',
          name: 'note_en',
          label: 'Note (English)',
          ui: {
            component: 'textarea',
          },
          required: true,
        },
        {
          type: 'string',
          name: 'note_vi',
          label: 'Note (Vietnamese)',
          ui: {
            component: 'textarea',
          },
          required: true,
        },
      ],
    },
    {
      type: 'object',
      name: 'friendship_gallery',
      label: 'Friendship Gallery Section',
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
          name: 'images',
          label: 'Gallery Images',
          list: true,
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
