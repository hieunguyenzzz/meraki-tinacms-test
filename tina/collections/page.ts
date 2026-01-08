import type { Collection } from "tinacms";
import { CustomImageField } from "../fields/CustomImageField";
import { JOURNAL_LOCATIONS } from "../constants";

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
      type: 'string',
      name: 'page_type',
      label: 'Page Type',
      options: ['homepage', 'journal-listing', 'about', 'contact'],
      ui: {
        component: 'select',
      },
    },
    {
      type: 'object',
      name: 'location_filters',
      label: 'Location Filters (Journal Listing Only)',
      list: true,
      ui: {
        itemProps: (item) => {
          return { label: item?.value };
        },
      },
      fields: [
        {
          type: 'string',
          name: 'value',
          label: 'Location Tag',
          options: JOURNAL_LOCATIONS,
          required: true,
        }
      ],
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
          ui: {
            component: CustomImageField,
          },
        },
        {
          type: 'image',
          name: 'featured_thumbnail',
          label: 'Featured Thumbnail',
          ui: {
            component: CustomImageField,
          },
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
      label: 'Services Section (Homapge Only)',
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
      ],
    },
    {
      type: 'object',
      name: 'lets_connect',
      label: "Let's Connect Section (Journal Listing Only)",
      description: 'This section is only used on journal-listing pages',
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
