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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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

interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (selectedImages: string[]) => void;
  initialDirectory?: string;
}

const MediaPicker = ({ open, onOpenChange, onInsert, initialDirectory = "journal" }: MediaPickerProps) => {
  const cms = useCMS();
  const [directory, setDirectory] = React.useState(initialDirectory);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = React.useState<any[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [offset, setOffset] = React.useState(0);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [columns, setColumns] = React.useState(5);
  const LIMIT = 20;

  const fetchMedia = React.useCallback(async (dir: string, currentOffset: number) => {
    setLoading(true);
    try {
      const result = await cms.media.list({
        directory: dir,
        limit: LIMIT,
        offset: currentOffset,
      });

      if (currentOffset === 0) {
        setItems(result.items);
      } else {
        setItems(prev => [...prev, ...result.items]);
      }

      setHasMore(!!result.nextOffset);
    } catch (e) {
      console.error('Fetch cms media error', e);
    } finally {
      setLoading(false);
    }
  }, [cms]);

  React.useEffect(() => {
    if (open) {
      setOffset(0);
      fetchMedia(directory, 0);
    }
  }, [directory, open]);

  const loadMore = () => {
    const newOffset = offset + LIMIT;
    setOffset(newOffset);
    fetchMedia(directory, newOffset);
  };

  const toggleSelection = (src: string) => {
    if (selectedItems.includes(src)) {
      setSelectedItems(selectedItems.filter(i => i !== src));
    } else {
      setSelectedItems([...selectedItems, src]);
    }
  };

  const handleFolderClick = (folderName: string) => {
    const newDir = directory ? `${directory}/${folderName}` : folderName;
    setDirectory(newDir);
  };

  const handleUpClick = () => {
    if (!directory) return;
    const parts = directory.split('/');
    parts.pop();
    setDirectory(parts.join('/'));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[80vw] sm:max-w-[1280px] p-0 flex flex-col gap-0">
        <SheetHeader className="p-4 border-b bg-gray-50">
          <SheetTitle>Select Images</SheetTitle>
        </SheetHeader>

        {/* Toolbar */}
        <div className="p-3 border-b flex items-center gap-3 bg-white">
          <button
            onClick={handleUpClick}
            disabled={!directory}
            className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span>↑</span> Up
          </button>
          <div className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600 font-mono truncate">
            /{directory}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Columns:</span>
            <select
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
            >
              {[2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {items.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No items found</p>
            </div>
          ) : (
            <div 
              className="grid gap-4"
              style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            >
              {items.map((item) => {
                if (item.type === 'dir') {
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleFolderClick(item.filename)}
                      className="aspect-square bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all shadow-sm"
                    >
                      <span className="text-4xl mb-2 text-yellow-400">📁</span>
                      <span className="text-xs text-center px-2 truncate w-full font-medium text-gray-700">{item.filename}</span>
                    </div>
                  )
                }

                const isSelected = selectedItems.includes(item.src);
                const thumbnailSrc = item.thumbnails?.['400x400'] || getThumborUrl('400x400', item.src);

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelection(item.src)}
                    className={`relative aspect-square bg-white border rounded-lg overflow-hidden cursor-pointer group transition-all shadow-sm ${isSelected ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-400'}`}
                  >
                    <img src={thumbnailSrc} alt={item.filename} className="w-full h-full object-contain" />

                    {/* Selection Indicator */}
                    <div className={`absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all ${isSelected ? 'bg-blue-500 text-white scale-100' : 'bg-gray-200/80 text-transparent scale-90 group-hover:scale-100 group-hover:bg-white group-hover:text-gray-400'}`}>
                      ✓
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-2 pt-6 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.filename}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {hasMore && (
            <div className="mt-6 text-center pb-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-full text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="p-4 border-t bg-white flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:justify-between">
          <div className="text-sm text-gray-600 font-medium">
            {selectedItems.length} selected
          </div>
          <div className="flex gap-3">
            <button onClick={() => onOpenChange(false)} className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">Cancel</button>
            <button
              onClick={() => onInsert(selectedItems)}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors"
            >
              Insert Selected ({selectedItems.length})
            </button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
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
