'use client';

import React from "react";
import { wrapFieldsWithMeta, useCMS, Template } from "tinacms";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable image item component
interface ImageData {
  src: string;
  alt_en: string;
  alt_vi: string;
}

interface SortableImageItemProps {
  image: ImageData;
  index: number;
  onRemove: (index: number) => void;
  onReplace: (index: number) => void;
  onAltChange: (index: number, lang: 'en' | 'vi', value: string) => void;
}

const SortableImageItem = ({
  image,
  index,
  onRemove,
  onReplace,
  onAltChange,
}: SortableImageItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `image-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative rounded cursor-grab active:cursor-grabbing group ${
        isDragging ? "opacity-50" : ""
      }`}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="w-full h-auto bg-gray-100 rounded mb-2 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
        onClick={() => onReplace(index)}
      >
        <img
          src={image.src}
          alt={image.alt_en || ""}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </button>

      {/* <div className="flex flex-col gap-1 mb-2">
        <input
          type="text"
          placeholder="Alt Text (EN)"
          value={image.alt_en || ""}
          onChange={(e) => onAltChange(index, "en", e.target.value)}
          className="px-1 py-0.5 text-xs border border-gray-200 rounded w-full"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
        <input
          type="text"
          placeholder="Alt Text (VI)"
          value={image.alt_vi || ""}
          onChange={(e) => onAltChange(index, "vi", e.target.value)}
          className="px-1 py-0.5 text-xs border border-gray-200 rounded w-full"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        />
      </div> */}

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 text-lg cursor-pointer border-none bg-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-50 hover:text-red-700"
        title="Remove image"
      >
        ✕
      </button>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GalleryField = wrapFieldsWithMeta(({ input, tinaForm }: any) => {
  const cms = useCMS();
  const images = input.value || [];

  // Get columns from sibling field
  const columnsPath = input.name.split('.').slice(0, -1).concat('columns').join('.');
  const columnsState = tinaForm.finalForm.getFieldState(columnsPath);
  const columns = parseInt(columnsState?.value || '1');

  // Get current filename for upload directory
  const formState = tinaForm.finalForm.getState();
  const uploadDir = `journal/${formState.values.slug}`;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesToUpload = Array.from(files).map(file => ({
      directory: uploadDir,
      file
    }));

    try {
      const assets = await cms.media.persist(filesToUpload);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newImages = assets.map((asset: any) => ({
        src: asset.src,
        alt_en: '',
        alt_vi: ''
      }));
      input.onChange([...images, ...newImages]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Upload failed", error);
      alert("Upload failed: " + errorMessage);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    input.onChange(newImages);
  };

  const replaceImage = (index: number) => {
    cms.media.open({
      allowDelete: true,
      directory: uploadDir,
      onSelect: (media) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], src: media.src };
        input.onChange(newImages);
      }
    })
  };

  const updateAlt = (index: number, lang: 'en' | 'vi', value: string) => {
    const newImages = [...images];
    newImages[index] = { ...newImages[index], [`alt_${lang}`]: value };
    input.onChange(newImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = images.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_: any, i: any) => `image-${i}` === active.id
      );
      const newIndex = images.findIndex(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_: any, i: any) => `image-${i}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        input.onChange(arrayMove(images, oldIndex, newIndex));
      }
    }
  };

  return (
    <div className="gallery-field">
      <div className="actions" style={{ marginBottom: '1rem', display: 'flex', gap: '10px' }}>
        <label style={{
          cursor: 'pointer',
          padding: '8px 16px',
          backgroundColor: '#0070f3',
          color: 'white',
          borderRadius: '4px',
          fontSize: '14px',
          display: 'inline-block'
        }}>
          Bulk Upload
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUpload}
          />
        </label>
        <button
          type="button"
          onClick={() => {
            cms.media.open({
              allowDelete: true,
              directory: uploadDir,
              onSelect: (media) => {
                input.onChange([...images, { src: media.src, alt_en: '', alt_vi: '' }]);
              }
            })
          }}
          style={{
            padding: '8px 16px',
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Select from Library
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '10px',
          borderRadius: '4px',
          maxHeight: '600px',
          overflowY: 'auto',
          columnCount: columns || 1,
          columnGap: '8px'
        }}>
          <SortableContext
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items={images.map((_: any, i: number) => `image-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            {images.map((image: ImageData, index: number) => (
              <SortableImageItem
                key={`image-${index}`}
                image={image}
                index={index}
                onRemove={removeImage}
                onReplace={() => replaceImage(index)}
                onAltChange={updateAlt}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
});

export const imageGalleryBlock: Template = {
  name: "imageGallery",
  label: "Image Gallery",
  ui: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemProps: (item: any) => ({
      label: `Image Gallery (${item?.images?.length || 0} images, ${item?.columns || 1
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
        component: GalleryField,
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
    // {
    //   type: "string",
    //   name: 'image_dir',
    //   label: "Image Upload Directory",
    //   description: "Directory where images will be uploaded",
    //   required: false,
    // },
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
