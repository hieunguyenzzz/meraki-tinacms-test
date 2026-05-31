import { Template } from 'tinacms';
import { CustomImageField } from '../fields/CustomImageField';

export const textImageBlock: Template = {
  name: 'textImageBlock',
  label: 'Text + Image Block',
  ui: {
    itemProps: (item) => ({
      label: item?.text?.title_en || 'Text + Image Block',
    }),
    defaultItem: {
      layout: 'text-left',
      verticalAlignment: 'center',
    },
  },
  fields: [
    {
      type: 'string',
      name: 'layout',
      label: 'Layout',
      options: [
        { value: 'text-left', label: 'Text Left / Image Right' },
        { value: 'text-right', label: 'Text Right / Image Left' },
      ],
      required: true,
    },
    {
      type: 'string',
      name: 'verticalAlignment',
      label: 'Text Vertical Alignment',
      options: [
        { value: 'center', label: 'Center' },
        { value: 'top', label: 'Top' },
      ],
    },
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
      type: 'rich-text',
      name: 'description_en',
      label: 'Description (English)',
      toolbarOverride: ['bold', 'italic', 'link'],
    },
    {
      type: 'rich-text',
      name: 'description_vi',
      label: 'Description (Vietnamese)',
      toolbarOverride: ['bold', 'italic', 'link'],
    },
    {
      type: 'image',
      name: 'image',
      label: 'Image',
      ui: {
        component: CustomImageField,
      },
    },
  ],
};
