'use client';

import React from "react";
import { useCMS } from "tinacms";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { getThumborUrl } from "../media/S3MediaStore";

export interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (selectedImages: string[]) => void;
  initialDirectory?: string;
  multiple?: boolean;
}

export const MediaPicker = ({ open, onOpenChange, onInsert, initialDirectory = "journal", multiple = true }: MediaPickerProps) => {
  const cms = useCMS();
  const [directory, setDirectory] = React.useState(initialDirectory);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = React.useState<any[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [columns, setColumns] = React.useState(5);
  const LIMIT = 20;
  const loaderRef = React.useRef<HTMLDivElement>(null);

  const fetchMedia = React.useCallback(async (dir: string, cursor?: string) => {
    setLoading(true);
    try {
      const result = await cms.media.list({
        directory: dir,
        limit: LIMIT,
        offset: cursor,
      });

      if (!cursor) {
        setItems(result.items);
      } else {
        setItems(prev => [...prev, ...result.items]);
      }

      setNextCursor(result.nextOffset as string | undefined);
      setHasMore(!!result.nextOffset);
    } catch (e) {
      console.error('Fetch cms media error', e);
    } finally {
      setLoading(false);
    }
  }, [cms]);

  React.useEffect(() => {
    if (open) {
      setNextCursor(undefined);
      fetchMedia(directory, undefined);
    }
  }, [directory, open]);

  const loadMore = React.useCallback(() => {
    if (nextCursor && !loading) {
      fetchMedia(directory, nextCursor);
    }
  }, [nextCursor, loading, fetchMedia, directory]);

  // Infinite scroll: auto-load when scrolling to bottom
  React.useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  const toggleSelection = (src: string) => {
    if (selectedItems.includes(src)) {
      setSelectedItems(selectedItems.filter(i => i !== src));
    } else {
      if (multiple) {
        setSelectedItems([...selectedItems, src]);
      } else {
        setSelectedItems([src]);
      }
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

          {/* Infinite scroll sentinel */}
          <div ref={loaderRef} className="mt-6 text-center pb-4 h-10">
            {loading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </div>
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
