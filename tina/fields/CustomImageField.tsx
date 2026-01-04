import React from "react";
import { wrapFieldsWithMeta } from "tinacms";
import { MediaPicker } from "../components/MediaPicker";
import { getThumborUrl } from "../media/S3MediaStore";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomImageField = wrapFieldsWithMeta(({ input }: any) => {
  const [showPicker, setShowPicker] = React.useState(false);

  const handleInsert = (selectedImages: Array<{ src: string; width: number; height: number }>) => {
    if (selectedImages.length > 0) {
      input.onChange(selectedImages[0].src);
    }
    setShowPicker(false);
  };

  return (
    <div className="relative">
      {input.value ? (
        <div className="relative group">
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="w-full h-48 bg-gray-100 rounded border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity flex items-center justify-center cursor-pointer"
          >
            <img
              src={getThumborUrl('400x400', input.value)}
              alt="Selected"
              className="max-w-full max-h-full object-contain"
            />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              input.onChange("");
            }}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 text-lg cursor-pointer border-none bg-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-50 hover:text-red-700 shadow-sm"
            title="Remove image"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
        >
          <span>Select Image</span>
        </button>
      )}

      <MediaPicker
        open={showPicker}
        onOpenChange={setShowPicker}
        onInsert={handleInsert}
        multiple={false}
      />
    </div>
  );
});
