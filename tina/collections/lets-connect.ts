import type { Collection } from 'tinacms';

const localizedStringFields = (
  name: string,
  label: string,
  options: { textarea?: boolean; required?: boolean } = {}
) => [
  {
    type: 'string' as const,
    name: `${name}_en`,
    label: `${label} (English)`,
    required: options.required,
    ...(options.textarea ? { ui: { component: 'textarea' as const } } : {}),
  },
  {
    type: 'string' as const,
    name: `${name}_vi`,
    label: `${label} (Vietnamese)`,
    required: options.required,
    ...(options.textarea ? { ui: { component: 'textarea' as const } } : {}),
  },
];

export const LetsConnect: Collection = {
  label: "Let's Connect Page",
  name: 'letsConnect',
  path: 'content/lets-connect',
  format: 'mdx',
  fields: [
    {
      type: 'object',
      name: 'hero',
      label: 'Hero Section',
      fields: [
        {
          type: 'image',
          name: 'image',
          label: 'Hero Image',
          required: true,
        },
        ...localizedStringFields('title', 'Title', { required: true }),
        ...localizedStringFields('image_alt', 'Image Alt Text', {
          required: true,
        }),
      ],
    },
    {
      type: 'object',
      name: 'introduction',
      label: 'Introduction',
      fields: [
        ...localizedStringFields('title', 'Title', { required: true }),
        {
          type: 'object',
          name: 'paragraphs',
          label: 'Paragraphs',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.text_en || item?.text_vi || 'Paragraph',
            }),
          },
          fields: localizedStringFields('text', 'Text', {
            textarea: true,
            required: true,
          }),
        },
        {
          type: 'object',
          name: 'contacts',
          label: 'Contact Details',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.label_en || item?.label_vi || 'Contact',
            }),
          },
          fields: [
            ...localizedStringFields('label', 'Label', { required: true }),
            {
              type: 'string',
              name: 'value',
              label: 'Displayed Value',
              required: true,
            },
            {
              type: 'string',
              name: 'link',
              label: 'Link (mailto:, tel:, or URL)',
              required: true,
            },
          ],
        },
      ],
    },
    {
      type: 'object',
      name: 'form',
      label: 'Inquiry Form',
      fields: [
        ...localizedStringFields(
          'personal_info_title',
          'Personal Information Title',
          {
            required: true,
          }
        ),
        ...localizedStringFields(
          'wedding_info_title',
          'Wedding Information Title',
          {
            required: true,
          }
        ),
        ...localizedStringFields(
          'additional_info_title',
          'Additional Information Title',
          {
            required: true,
          }
        ),
        ...localizedStringFields('first_name_label', 'First Name Label', {
          required: true,
        }),
        ...localizedStringFields('last_name_label', 'Last Name Label', {
          required: true,
        }),
        ...localizedStringFields('role_label', 'Role Label', {
          required: true,
        }),
        ...localizedStringFields('role_hint', 'Role Hint', {
          textarea: true,
        }),
        ...localizedStringFields('partner_name_label', 'Partner Name Label', {
          required: true,
        }),
        ...localizedStringFields('email_label', 'Email Label', {
          required: true,
        }),
        ...localizedStringFields('phone_label', 'Phone Label', {
          required: true,
        }),
        ...localizedStringFields('phone_hint', 'Phone Hint', {
          textarea: true,
        }),
        ...localizedStringFields('location_label', 'Current Location Label', {
          required: true,
        }),
        ...localizedStringFields('wedding_date_label', 'Wedding Date Label', {
          required: true,
        }),
        ...localizedStringFields('venue_label', 'Wedding Venue/City Label', {
          required: true,
        }),
        ...localizedStringFields('guest_count_label', 'Guest Count Label', {
          required: true,
        }),
        ...localizedStringFields('budget_label', 'Budget Label', {
          required: true,
        }),
        ...localizedStringFields('budget_hint', 'Budget Hint', {
          textarea: true,
        }),
        ...localizedStringFields('extra_events_label', 'Extra Events Prompt', {
          required: true,
        }),
        {
          type: 'object',
          name: 'event_options',
          label: 'Extra Event Options',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.label_en || item?.label_vi || 'Event',
            }),
          },
          fields: localizedStringFields('label', 'Label', { required: true }),
        },
        ...localizedStringFields('referral_label', 'Referral Prompt', {
          required: true,
        }),
        {
          type: 'object',
          name: 'referral_options',
          label: 'Referral Options',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.label_en || item?.label_vi || 'Source',
            }),
          },
          fields: localizedStringFields('label', 'Label', { required: true }),
        },
        ...localizedStringFields('other_notes_label', 'Other Notes Label', {
          required: true,
        }),
        ...localizedStringFields('notes_hint', 'Other Notes Hint', {
          textarea: true,
        }),
        ...localizedStringFields('send_label', 'Send Button Label', {
          required: true,
        }),
        ...localizedStringFields('sending_label', 'Sending Button Label', {
          required: true,
        }),
        ...localizedStringFields('success_message', 'Success Message', {
          textarea: true,
          required: true,
        }),
        ...localizedStringFields('error_message', 'Error Message', {
          textarea: true,
          required: true,
        }),
      ],
    },
    {
      type: 'object',
      name: 'faq_section',
      label: 'FAQ Section',
      fields: [
        ...localizedStringFields('title', 'Title', { required: true }),
        {
          type: 'object',
          name: 'items',
          label: 'Questions',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.question_en || item?.question_vi || 'Question',
            }),
          },
          fields: [
            ...localizedStringFields('question', 'Question', {
              required: true,
            }),
            ...localizedStringFields('answer', 'Answer', {
              textarea: true,
              required: true,
            }),
          ],
        },
      ],
    },
    {
      type: 'object',
      name: 'instagram_section',
      label: 'Instagram Section',
      fields: [
        ...localizedStringFields('title', 'Title', { required: true }),
        {
          type: 'object',
          name: 'images',
          label: 'Images',
          list: true,
          ui: {
            itemProps: (item) => ({
              label: item?.alt_en || item?.alt_vi || 'Image',
            }),
          },
          fields: [
            { type: 'image', name: 'image', label: 'Image', required: true },
            ...localizedStringFields('alt', 'Alt Text', { required: true }),
            { type: 'string', name: 'link', label: 'Instagram Link' },
          ],
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
