import type { Template } from "tinacms";

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
