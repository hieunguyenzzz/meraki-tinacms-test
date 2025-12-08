# Gallery Field Guide

This guide documents the custom `GalleryField` component used in the Image Gallery block.

## Features

1. **Bulk Upload**: Allows selecting multiple images from your computer and uploading them directly to `images/journal/[filename]`.
2. **Grid Preview**: Renders images in a grid layout that matches the "Columns" setting of the block.
3. **Inline Editing**: Edit Alt Text (EN/VI) directly on the image card.
4. **Reordering**: Move images left/right using arrow buttons.

## Implementation Details

The component is defined in `tina/templates.tsx` and uses:

- `wrapFieldsWithMeta` from TinaCMS to access form state.
- `useCMS` to access the Media Manager API.
- `tinaForm.finalForm` to read sibling fields (like `columns`) and document metadata (like `filename`).

### Code Structure

```tsx
const GalleryField = wrapFieldsWithMeta(({ input, tinaForm }) => {
  // ...
});
```

## Usage

The component is assigned to the images field in the imageGalleryBlock template:

```ts
export const imageGalleryBlock: Template = {
  // ...
  fields: [
    {
      name: "images",
      ui: {
        component: GalleryField,
      },
      // ...
    }
  export const imageGalleryBlock: Template = {
  // ...
  fields: [
    {
      name: "images",
      ui: {
        component: GalleryField,
      },
      // ...
    }
  ]}
```

## Maintenance

If you need to change the upload directory logic, look for the `uploadDir` variable in `GalleryField`.
Currently it is set to: `images/journal/${filename}`
