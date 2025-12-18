import type { Template } from "tinacms";
import { CustomImageField } from "../fields/CustomImageField";

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
      ui: {
        component: CustomImageField,
      },
    },
    {
      type: "image",
      name: "image_right",
      label: "Right Image",
      ui: {
        component: CustomImageField,
      },
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
    // {
    //   type: "string",
    //   name: "caption_en",
    //   label: "Caption (English)",
    // },
    // {
    //   type: "string",
    //   name: "caption_vi",
    //   label: "Caption (Vietnamese)",
    // },
  ],
};