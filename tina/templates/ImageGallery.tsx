'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type Masonry from 'masonry-layout';
import React from "react";
import { Template, useCMS, wrapFieldsWithMeta } from "tinacms";
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
  widthClass: string;
}

// Inputs live inside the drag-listener wrapper, so their pointer and key events
// must not bubble or dnd-kit starts a drag while the editor is typing.
const stopDragEvents = {
  onPointerDown: (e: React.PointerEvent) => e.stopPropagation(),
  onKeyDown: (e: React.KeyboardEvent) => e.stopPropagation(),
  onClick: (e: React.MouseEvent) => e.stopPropagation(),
};

const altInputStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '4px 6px',
  border: '1px solid #ddd',
  borderRadius: '3px',
  fontSize: '12px',
  cursor: 'text',
};

const altInputsWrapperStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginTop: '4px',
};

const SortableImageItem = ({
  image,
  index,
  onRemove,
  onReplace,
  onAltChange,
  widthClass,
}: SortableImageItemProps) => {
  // Use a safe ID that handles whitespaces and special characters
  const itemId = React.useMemo(() =>
    image.src ? encodeURIComponent(image.src) : `image-${index}`,
    [image.src, index]
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-index={index}
      className={`masonry-item ${widthClass} relative rounded cursor-grab active:cursor-grabbing group mb-2 min-h-24 bg-gray-100 ${isDragging ? "opacity-50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        className="w-full h-full bg-gray-100 rounded overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center min-h-24"
        onClick={(e) => {
          e.stopPropagation();
          onReplace(index);
        }}
      >
        <img
          src={getThumborUrl('180x', image.src)}
          alt={image.alt_en || ""}
          className="w-full h-full object-contain block"
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

      {/* Alt text — the schema has always had these fields but no UI, which is
          why nearly every gallery image in content/ ships with a blank alt. */}
      <div style={altInputsWrapperStyle}>
        <input
          type="text"
          value={image.alt_en || ''}
          placeholder="Alt text (English)"
          onChange={(e) => onAltChange(index, 'en', e.target.value)}
          style={altInputStyle}
          {...stopDragEvents}
        />
        <input
          type="text"
          value={image.alt_vi || ''}
          placeholder="Alt text (Vietnamese)"
          onChange={(e) => onAltChange(index, 'vi', e.target.value)}
          style={altInputStyle}
          {...stopDragEvents}
        />
      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GalleryField = wrapFieldsWithMeta(({ input, tinaForm }: any) => {
  const cms = useCMS();
  const images = React.useMemo(() => input.value || [], [input.value]);
  const [showMediaPicker, setShowMediaPicker] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const masonryRef = React.useRef<Masonry | null>(null);

  // Get columns from sibling field
  const columnsPath = input.name.split('.').slice(0, -1).concat('columns').join('.');
  const columnsState = tinaForm.finalForm.getFieldState(columnsPath);
  const columns = parseInt(columnsState?.value || '1');

  const widthClass = columns === 1 ? 'w-full' :
    columns === 2 ? 'w-[calc(50%-16px)]' :
      columns === 3 ? 'w-[calc(33.333%-16px)]' :
        'w-[calc(25%-16px)]';

  // Get current filename for upload directory
  const formState = tinaForm.finalForm.getState();
  const uploadDir = `journal/${formState.values.slug}`;

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

  const masonryInstance = React.useRef<Masonry | null>(null);

  React.useEffect(() => {
    const initMasonry = async () => {
      const Masonry = (await import('masonry-layout')).default;
      const imagesLoaded = (await import('imagesloaded')).default;

      if (containerRef.current) {
        if (!masonryInstance.current) {
          masonryInstance.current = new Masonry(containerRef.current, {
            itemSelector: '.masonry-item',
            columnWidth: '.grid-sizer',
            gutter: 8,
            percentPosition: true,
            transitionDuration: '0.3s',
          });
          masonryRef.current = masonryInstance.current;
        } else {
          masonryInstance.current.reloadItems?.();
          masonryInstance.current.layout?.();
        }

        const imgLoaded = imagesLoaded(containerRef.current);
        imgLoaded.on('progress', () => {
          masonryInstance.current?.layout?.();
        });

        setTimeout(() => {
          masonryInstance.current?.layout?.();
        }, 100);
      }
    };

    initMasonry();
  }, [images, columns]);

  React.useEffect(() => {
    return () => {
      masonryInstance.current?.destroy?.();
    };
  }, []);

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    input.onChange(newImages);
  };

  const getDirectoryFromImageSrc = (src?: string): string | undefined => {
    if (!src) return undefined;

    // Normalize URL/paths and return directory without a leading slash.
    const stripLeadingSlash = (value: string) => value.replace(/^\//, '');

    let path = src;
    try {
      // Handles absolute URLs (e.g. S3 URLs) and keeps pathname only.
      path = new URL(src).pathname;
    } catch {
      // If it's already a relative path, use it as-is.
      path = src;
    }

    path = stripLeadingSlash(path.split('?')[0].split('#')[0] || '');

    if (!path || !path.includes('/')) return undefined;
    return path.substring(0, path.lastIndexOf('/')) || undefined;
  };

  const replaceImage = (index: number) => {
    const currentImageDir = getDirectoryFromImageSrc(images[index]?.src);

    cms.media.open({
      allowDelete: true,
      directory: currentImageDir || uploadDir,
      onSelect: async (media) => {
        if (!media?.src) return;
        const newImages = [...images];

        // Fetch dimensions
        const img = new Image();
        img.src = getThumborUrl('0x0', media.src);
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });

        newImages[index] = {
          ...newImages[index],
          src: media.src,
          width: img.naturalWidth,
          height: img.naturalHeight
        };
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
      // Capture scroll position of the Tina sidebar or main window
      const scrollParent = containerRef.current?.closest('.tina-sidebar-content') ||
        containerRef.current?.closest('[style*="overflow: auto"]') ||
        containerRef.current?.closest('[style*="overflow: scroll"]');
      const scrollTop = scrollParent ? scrollParent.scrollTop : window.scrollY;

      const oldIndex = images.findIndex(
        (img: ImageData, i: number) => (img.src ? encodeURIComponent(img.src) : `image-${i}`) === active.id
      );
      const newIndex = images.findIndex(
        (img: ImageData, i: number) => (img.src ? encodeURIComponent(img.src) : `image-${i}`) === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        input.onChange(arrayMove(images, oldIndex, newIndex));

        // Restore scroll position after Tina re-renders
        if (scrollParent) {
          requestAnimationFrame(() => {
            scrollParent.scrollTop = scrollTop;
          });
        } else {
          requestAnimationFrame(() => {
            window.scrollTo(window.scrollX, scrollTop);
          });
        }

        // Masonry will re-layout on next render
        setTimeout(() => masonryRef.current?.layout?.(), 100);
      }
    }
  };

  const missingAltCount = images.filter(
    (img: ImageData) => !(img.alt_en || '').trim()
  ).length;

  return (
    <div className="gallery-field">
      {missingAltCount > 0 && (
        <p
          style={{
            marginBottom: '0.75rem',
            padding: '8px 10px',
            backgroundColor: '#fff7e6',
            border: '1px solid #f0d9a0',
            borderRadius: '4px',
            fontSize: '13px',
            lineHeight: 1.4,
            whiteSpace: 'normal',
            overflowWrap: 'anywhere',
          }}
        >
          {missingAltCount} of {images.length} images have no English alt text.
          Google Images and screen readers need it. Until it is filled in, the
          site falls back to the couple, venue and location.
        </p>
      )}

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
        <div
          ref={containerRef}
          className="relative"
          style={{
            backgroundColor: '#f9f9f9',
            padding: '10px',
            borderRadius: '4px',
            minHeight: '100px'
          }}
        >
          {/* Sizer element for Masonry */}
          <div className={`grid-sizer ${widthClass} absolute invisible`} />

          <SortableContext
            items={images.map((img: ImageData, i: number) => img.src ? encodeURIComponent(img.src) : `image-${i}`)}
            strategy={rectSortingStrategy}
          >
            {images.map((image: ImageData, index: number) => (
              <SortableImageItem
                key={image.src ? encodeURIComponent(image.src) : `image-${index}`}
                image={image}
                index={index}
                onRemove={removeImage}
                onReplace={replaceImage}
                onAltChange={updateAlt}
                widthClass={widthClass}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      <MediaPicker
        open={showMediaPicker}
        onOpenChange={setShowMediaPicker}
        onInsert={(selectedImages) => {
          const newImages = selectedImages.map(img => ({
            src: img.src,
            width: img.width,
            height: img.height,
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
          type: "string",
          name: "src",
          label: "Image",
          ui: {
            component: () => null,
          },
        },
        {
          type: "number",
          name: "width",
          label: "Width",
          ui: {
            component: () => null
          }
        },
        {
          type: "number",
          name: "height",
          label: "Height",
          ui: {
            component: () => null
          }
        },
        {
          // Not `required: true` — 2,774 existing alt fields are blank, so
          // required-ness would block editors from saving any existing journal.
          type: "string",
          name: "alt_en",
          label: "Alt Text (English)",
          description:
            "Describe the photo for Google Images and screen readers, e.g. 'Bride and groom exchanging vows in the courtyard at Lan Viên Cố Tích'. Leave blank only for purely decorative images.",
        },
        {
          type: "string",
          name: "alt_vi",
          label: "Alt Text (Vietnamese)",
          description:
            "Vietnamese description of the photo, shown on /vi pages.",
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
