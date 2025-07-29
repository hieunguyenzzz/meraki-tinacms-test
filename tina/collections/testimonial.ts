import { Collection } from "tinacms";

export const Testimonial: Collection = {
  name: "testimonial",
  label: "Testimonials",
  path: "content/testimonials",
  format: "mdx",
  fields: [
    {
      type: "string",
      name: "client_name",
      label: "Client Name",
      required: true,
    },
    {
      type: "rich-text",
      name: "testimonial_en",
      label: "Testimonial (English)",
      required: true,
    },
    {
      type: "rich-text",
      name: "testimonial_vi",
      label: "Testimonial (Vietnamese)",
      required: true,
    },
    {
      type: "image",
      name: "client_photo",
      label: "Client Photo",
    },
    {
      type: "datetime",
      name: "wedding_date",
      label: "Wedding Date",
    },
    {
      type: "number",
      name: "rating",
      label: "Rating (1-5 stars)",
      required: true,
      ui: {
        validate: (value) => {
          if (value < 1 || value > 5) {
            return "Rating must be between 1 and 5"
          }
        }
      }
    },
    {
      type: "boolean",
      name: "featured",
      label: "Featured Testimonial",
      required: true,
    },
    {
      type: "boolean",
      name: "published",
      label: "Published",
      required: true,
    },
  ],
};