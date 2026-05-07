'use client';

import React from "react";
import { useCMS } from "tinacms";
import { getThumborUrl } from "../media/S3MediaStore";

interface MediaManagerScreenProps {
  close: () => void;
}

export const MediaManagerScreen = ({ close: _close }: MediaManagerScreenProps) => {
  const cms = useCMS();
  const [directory, setDirectory] = React.useState("journal");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [items, setItems] = React.useState<any[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [columns, setColumns] = React.useState(5);
  const [bulkDeleteMode, setBulkDeleteMode] = React.useState(false);
  const [bulkDeleteItems, setBulkDeleteItems] = React.useState<string[]>([]);
  const [deleting, setDeleting] = React.useState(false);
  const LIMIT = 20;
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName && folderName.trim()) {
      const newDir = directory ? `${directory}/${folderName.trim()}` : folderName.trim();
      setDirectory(newDir);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const filesToUpload = Array.from(files).map((file) => ({
        directory: directory || "",
        file,
      }));

      await cms.media.persist(filesToUpload);

      setNextCursor(undefined);
      fetchMedia(directory, undefined);
    } catch (e) {
      console.error("Upload failed", e);
      alert("Upload failed. See console for details.");
    } finally {
      setLoading(false);
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  };

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
    setNextCursor(undefined);
    fetchMedia(directory, undefined);
  }, [directory]);

  const loadMore = React.useCallback(() => {
    if (nextCursor && !loading) {
      fetchMedia(directory, nextCursor);
    }
  }, [nextCursor, loading, fetchMedia, directory]);

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

  const imageItems = items.filter(item => item.type !== 'dir');
  const allImageSrcs = imageItems.map(item => item.src as string);
  const allBulkSelected = allImageSrcs.length > 0 && allImageSrcs.every(src => bulkDeleteItems.includes(src));

  const handleSelectAll = () => {
    if (allBulkSelected) {
      setBulkDeleteItems(prev => prev.filter(src => !allImageSrcs.includes(src)));
    } else {
      setBulkDeleteItems(prev => {
        const merged = [...prev];
        for (const src of allImageSrcs) {
          if (!merged.includes(src)) merged.push(src);
        }
        return merged;
      });
    }
  };

  const toggleBulkDelete = (src: string) => {
    setBulkDeleteItems(prev =>
      prev.includes(src) ? prev.filter(i => i !== src) : [...prev, src]
    );
  };

  const handleEnterBulkDelete = () => {
    setBulkDeleteItems([]);
    setBulkDeleteMode(true);
  };

  const handleExitBulkDelete = () => {
    setBulkDeleteMode(false);
    setBulkDeleteItems([]);
  };

  const handleDeleteSelected = async () => {
    if (bulkDeleteItems.length === 0) return;
    const confirmed = confirm(`Delete ${bulkDeleteItems.length} selected image${bulkDeleteItems.length > 1 ? 's' : ''}? This cannot be undone.`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      const response = await fetch('/api/s3/batch-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keys: bulkDeleteItems }),
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.errors && result.errors.length > 0) {
        console.error('Some files failed to delete:', result.errors);
        alert(`${result.deleted} file(s) deleted. ${result.errors.length} failed.`);
      }

      setBulkDeleteItems([]);
      setBulkDeleteMode(false);
      setNextCursor(undefined);
      fetchMedia(directory, undefined);
    } catch (e) {
      console.error('Delete failed', e);
      alert('Delete failed. See console for details.');
    } finally {
      setDeleting(false);
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
    <div className="w-full h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="p-3 border-b flex items-center gap-3 bg-white">
        <button
          onClick={handleUpClick}
          disabled={!directory || bulkDeleteMode}
          className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span>↑</span> Up
        </button>

        <button
          onClick={handleCreateFolder}
          disabled={bulkDeleteMode}
          className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <span>+</span> New Folder
        </button>

        <button
          onClick={() => uploadInputRef.current?.click()}
          disabled={bulkDeleteMode}
          className="px-3 py-1.5 bg-blue-600 text-white border border-blue-600 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
        >
          <span>↑</span> Upload
        </button>
        <input
          ref={uploadInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleUpload}
        />

        {!bulkDeleteMode && imageItems.length > 0 && (
          <button
            onClick={handleEnterBulkDelete}
            className="px-3 py-1.5 bg-red-50 border border-red-300 text-red-700 rounded text-sm font-medium hover:bg-red-100 flex items-center gap-1"
          >
            🗑 Bulk Delete
          </button>
        )}

        {bulkDeleteMode && imageItems.length > 0 && (
          <button
            onClick={handleSelectAll}
            className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded text-sm font-medium hover:bg-gray-200 flex items-center gap-1"
          >
            {allBulkSelected ? '☐ Deselect All' : '☑ Select All'}
          </button>
        )}

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

      {/* Bulk delete mode banner */}
      {bulkDeleteMode && (
        <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <span>🗑</span>
          <span>Bulk Delete Mode — click images to mark for deletion.</span>
        </div>
      )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
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
                    onClick={() => !bulkDeleteMode && handleFolderClick(item.filename)}
                    className={`aspect-square bg-white border border-gray-200 rounded-lg flex flex-col items-center justify-center transition-all shadow-sm ${bulkDeleteMode ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-50 hover:border-blue-300'}`}
                  >
                    <span className="text-4xl mb-2 text-yellow-400">📁</span>
                    <span className="text-xs text-center px-2 truncate w-full font-medium text-gray-700">{item.filename}</span>
                  </div>
                );
              }

              const isBulkSelected = bulkDeleteItems.includes(item.src);
              const thumbnailSrc = item.thumbnails?.['400x400'] || getThumborUrl('400x400', item.src);

              return (
                <div
                  key={item.id}
                  onClick={() => bulkDeleteMode && toggleBulkDelete(item.src)}
                  className={`relative aspect-square bg-white border rounded-lg overflow-hidden transition-all shadow-sm ${
                    bulkDeleteMode
                      ? `cursor-pointer ${isBulkSelected ? 'ring-2 ring-red-500 border-red-500' : 'hover:border-red-300'}`
                      : 'cursor-default'
                  }`}
                >
                  <img src={thumbnailSrc} alt={item.filename} className="w-full h-full object-contain" loading="lazy" />

                  {bulkDeleteMode && (
                    <div className={`absolute top-2 right-2 rounded-full w-6 h-6 flex items-center justify-center text-xs transition-all ${isBulkSelected ? 'bg-red-500 text-white scale-100' : 'bg-gray-200/80 text-transparent scale-90 group-hover:scale-100 group-hover:bg-white group-hover:text-gray-400'}`}>
                      ✕
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white text-xs p-2 pt-6 truncate opacity-0 hover:opacity-100 transition-opacity">
                    {item.filename}
                  </div>
                </div>
              );
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
      {bulkDeleteMode && (
        <div className="p-4 border-t bg-white flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="text-sm font-medium text-red-600">
            Bulk Delete Mode — {bulkDeleteItems.length} selected
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExitBulkDelete}
              disabled={deleting}
              className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSelected}
              disabled={bulkDeleteItems.length === 0 || deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium shadow-sm transition-colors"
            >
              {deleting ? 'Deleting…' : `Delete Selected (${bulkDeleteItems.length})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
