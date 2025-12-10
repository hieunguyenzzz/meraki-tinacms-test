import { Template } from "tinacms";

export const textImageBlock: Template = {
  name: "textImageBlock",
  label: "Text + Image Block",
  ui: {
    itemProps: (item) => ({
      label: item?.text?.title_en || "Text + Image Block",
    }),
    defaultItem: {
      layout: "text-left",
    },
  },
  fields: [
    {
      type: "string",
      name: "layout",
      label: "Layout",
      options: [
        { value: "text-left", label: "Text Left / Image Right" },
        { value: "text-right", label: "Text Right / Image Left" },
      ],
      required: true,
    },
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
      type: "image",
      name: "image",
      label: "Image",
    },
    // {
    //   type: "string",
    //   name: "image_alt_en",
    //   label: "Image Alt Text (English)",
    // },
    // {
    //   type: "string",
    //   name: "image_alt_vi",
    //   label: "Image Alt Text (Vietnamese)",
    // },
  ],
};
