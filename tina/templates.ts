import type { Template } from "tinacms";

export const imageGalleryBlock: Template = {
  name: "imageGallery",
  label: "Image Gallery",
  ui: {
    itemProps: (item) => ({
      label: `Image Gallery (${item?.images?.length || 0} images, ${
        item?.columns || 1
      } col)`,
    }),
  },
  fields: [
    {
      type: "object",
      name: "images",
      label: "Images",
      list: true,
      ui: {
        itemProps: (item) => ({
          label: item?.alt_en || "Image",
          style: {
            backgroundImage: `url(${item?.src})`,
            backgroundSize: "contain",
            height: "50px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          },
        }),
      },
      fields: [
        {
          type: "image",
          name: "src",
          label: "Image",
        },
        {
          type: "string",
          name: "alt_en",
          label: "Alt Text (English)",
        },
        {
          type: "string",
          name: "alt_vi",
          label: "Alt Text (Vietnamese)",
        },
      ],
    },
    {
      type: "string",
      name: "columns",
      label: "Columns",
      options: [
        { value: "1", label: "1 Column (Full Width)" },
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "4", label: "4 Columns" },
      ],
    },
    {
      type: "string",
      name: "caption_en",
      label: "Caption (English)",
    },
    {
      type: "string",
      name: "caption_vi",
      label: "Caption (Vietnamese)",
    },
  ],
};

export const twoImagesAsymmetryBlock: Template = {
  name: "twoImagesAsymmetry",
  label: "Two Images Asymmetry",
  ui: {
    itemProps: (item) => ({
      label: `Two Images Asymmetry (${item?.offset || "none"})`,
    }),
  },
  fields: [
    {
      type: "image",
      name: "image_left",
      label: "Left Image",
    },
    {
      type: "image",
      name: "image_right",
      label: "Right Image",
    },
    {
      type: "string",
      name: "offset",
      label: "Offset Direction",
      description: "Which image should be offset vertically",
      options: [
        { value: "up", label: "Left Up / Right Down" },
        { value: "down", label: "Left Down / Right Up" },
      ],
    },
    {
      type: "string",
      name: "caption_en",
      label: "Caption (English)",
    },
    {
      type: "string",
      name: "caption_vi",
      label: "Caption (Vietnamese)",
    },
  ],
};

export const textBlock: Template = {
  name: "textBlock",
  label: "Text Block",
  ui: {
    itemProps: (item) => ({
      label: item?.title_en || "Text Block",
    }),
  },
  fields: [
    {
      type: "string",
      name: "title_en",
      label: "Title (English)",
    },
    {
      type: "string",
      name: "title_vi",
      label: "Title (Vietnamese)",
    },
    {
      type: "string",
      name: "description_en",
      label: "Description (English)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "description_vi",
      label: "Description (Vietnamese)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "alignment",
      label: "Text Alignment",
      options: [
        { value: "left", label: "Left" },
        { value: "center", label: "Center" },
        { value: "right", label: "Right" },
      ],
    },
  ],
};

export const spacingBlock: Template = {
  name: "spacing",
  label: "Spacing",
  ui: {
    itemProps: (item) => ({
      label: `Spacing (${item?.size || "md"})`,
    }),
  },
  fields: [
    {
      type: "string",
      name: "size",
      label: "Size",
      options: [
        { value: "sm", label: "Small (24px)" },
        { value: "md", label: "Medium (48px)" },
        { value: "lg", label: "Large (64px)" },
        { value: "xl", label: "Extra Large (96px)" },
      ],
    },
  ],
};
