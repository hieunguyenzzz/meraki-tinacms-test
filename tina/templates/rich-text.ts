import { Template } from 'tinacms';

type RichTextNode = {
  text?: string;
  children?: RichTextNode[];
};

const extractText = (
  node: RichTextNode | RichTextNode[] | undefined
): string => {
  if (!node) {
    return '';
  }

  const nodes = Array.isArray(node) ? node : [node];
  let output = '';

  for (const item of nodes) {
    if (typeof item.text === 'string') {
      output += `${item.text} `;
    }
    if (item.children) {
      output += `${extractText(item.children)} `;
    }
  }

  return output.replace(/\s+/g, ' ').trim();
};

export const richTextBlock: Template = {
  name: 'richTextBlock',
  label: 'Rich Text Block',
  ui: {
    itemProps: (item) => ({
      label:
        extractText(item?.content_en) ||
        extractText(item?.content_vi) ||
        'Rich Text Block',
    }),
  },
  fields: [
    {
      type: 'rich-text',
      name: 'content_en',
      label: 'Content (English)',
      toolbarOverride: ['heading', 'bold', 'italic', 'link', 'ul', 'image'],
    },
    {
      type: 'rich-text',
      name: 'content_vi',
      label: 'Content (Vietnamese)',
      toolbarOverride: ['heading', 'bold', 'italic', 'link', 'ul', 'image'],
    },
  ],
};
