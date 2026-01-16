import { Template } from "tinacms";

export const testimonialBlock: Template = {
  name: "testimonial",
  label: "Testimonial",
  ui: {
    itemProps: () => ({
      label: "Testimonial",
    }),
  },
  fields: [
    // {
    //   type: "string",
    //   name: "heading",
    //   label: "Testimonial Heading",
    //   description: "e.g., 'Testimonial'",
    // },
    {
      type: "string",
      name: "decorative_text_en",
      label: "Decorative Text (English)",
      description: "Decorative script text above quote (e.g., cursive text)",
    },
    {
      type: "string",
      name: "decorative_text_vi",
      label: "Decorative Text (Vietnamese)",
      description: "Decorative script text above quote (e.g., cursive text)",
    },
    {
      type: "string",
      name: "quote_en",
      label: "Content (English)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "quote_vi",
      label: "Content (Vietnamese)",
      ui: {
        component: "textarea",
      },
    },
    {
      type: "string",
      name: "author",
      label: "Quote Author",
    },
  ],
};
