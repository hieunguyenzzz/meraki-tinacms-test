import { Template } from "tinacms";

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
      type: "rich-text",
      name: "description_en",
      label: "Description (English)",
      toolbarOverride: ["bold", "italic", "link"],
    },
    {
      type: "rich-text",
      name: "description_vi",
      label: "Description (Vietnamese)",
      toolbarOverride: ["bold", "italic", "link"],
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
    {
      type: "string",
      name: "columnLayout",
      label: "Description Columns",
      options: [
        { value: "1", label: "1 Column" },
        { value: "2", label: "2 Columns" },
        { value: "3", label: "3 Columns" },
        { value: "title-left", label: "Title Left / Description Right" },
      ],
    },
  ],
};