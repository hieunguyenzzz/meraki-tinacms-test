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
import { MediaPicker } from "../components/MediaPicker";
import { getThumborUrl } from "../media/S3MediaStore";

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
      className={`relative rounded cursor-grab active:cursor-grabbing group ${isDragging ? "opacity-50" : ""
        }`}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="w-full h-auto bg-gray-100 rounded mb-2 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          onReplace(index);
        }}
      >
        <img
          src={getThumborUrl('400x400', image.src)}
          alt={image.alt_en || ""}
          className="max-w-full max-h-full object-contain"
          draggable={false}
        />
      </button>

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
  const [showMediaPicker, setShowMediaPicker] = React.useState(false);

  // Get columns from sibling field
  const columnsPath = input.name.split('.').slice(0, -1).concat('columns').join('.');
  const columnsState = tinaForm.finalForm.getFieldState(columnsPath);
  const columns = parseInt(columnsState?.value || '1');

  // Get current filename for upload directory
  const formState = tinaForm.finalForm.getState();
  const uploadDir = `images/journal/${formState.values.slug}`;

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        <button
          type="button"
          onClick={() => setShowMediaPicker(true)}
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
                onReplace={replaceImage}
                onAltChange={updateAlt}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onInsert={(selectedImages) => {
          const newImages = selectedImages.map(src => ({
            src,
            alt_en: '',
            alt_vi: ''
          }));
          input.onChange([...images, ...newImages]);
          setShowMediaPicker(false);
        }}
        initialDirectory={uploadDir}
      />
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
