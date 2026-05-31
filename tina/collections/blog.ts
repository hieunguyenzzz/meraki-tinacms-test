import { richTextBlock } from 'tina/templates/rich-text';
import { Collection } from 'tinacms';
import { CustomImageField } from '../fields/CustomImageField';
import { imageGalleryBlock } from '../templates/ImageGallery';
import { spacingBlock } from '../templates/spacing';
import { textBlock } from '../templates/text';
import { textImageBlock } from '../templates/textImage';
import { twoImagesAsymmetryBlock } from '../templates/twoImagesAsymmetry';

const blogTextBlock = {
  ...textBlock,
  fields: textBlock.fields?.filter(
    (field) =>
      field.name !== 'title_en' &&
      field.name !== 'title_vi' &&
      field.name !== 'alignment' &&
      field.name !== 'columnLayout'
  ),
};

export const Blog: Collection = {
  name: 'blog',
  label: 'Blog Posts',
  path: 'content/blog',
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
      type: 'image',
      name: 'featured_image',
      label: 'Featured Image',
      ui: {
        component: CustomImageField,
      },
    },
    {
      type: 'string',
      name: 'excerpt_en',
      label: 'Excerpt (English)',
      ui: {
        component: 'textarea',
      },
    },
    {
      type: 'string',
      name: 'excerpt_vi',
      label: 'Excerpt (Vietnamese)',
      ui: {
        component: 'textarea',
      },
    },
    // Flexible Content Blocks (block builder, same as journal)
    {
      type: 'object',
      name: 'content_blocks',
      label: 'Content Blocks',
      list: true,
      templates: [
        blogTextBlock,
        richTextBlock,
        textImageBlock,
        imageGalleryBlock,
        twoImagesAsymmetryBlock,
        spacingBlock,
      ],
    },
    {
      type: 'string',
      name: 'categories',
      label: 'Categories',
      list: true,
    },
    {
      type: 'string',
      name: 'tags',
      label: 'Tags',
      list: true,
    },
    {
      type: 'string',
      name: 'slug',
      label: 'URL Slug',
      required: true,
    },
    {
      type: 'datetime',
      name: 'published_date',
      label: 'Published Date',
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
    {
      type: 'boolean',
      name: 'published',
      label: 'Published',
      required: true,
    },
  ],
};
