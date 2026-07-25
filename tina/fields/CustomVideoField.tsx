import React from 'react';
import { wrapFieldsWithMeta } from 'tinacms';
import type { InputFieldType, TinaField } from 'tinacms';
import {
  MediaPicker,
  type SelectedMedia,
} from '../components/MediaPicker';
import { getMediaKind } from '../media/mediaType';

type CustomVideoFieldProps = InputFieldType<object, object>;
type TinaVideoComponentProps = {
  field: TinaField & { namespace: string[] };
  input: {
    name: string;
    onBlur: (event?: React.FocusEvent<string>) => void;
    onChange: (event: React.ChangeEvent<string>) => void;
    onFocus: (event?: React.FocusEvent<string>) => void;
    type?: string;
    value: string | string[];
  };
  meta: {
    active?: boolean;
    dirty?: boolean;
    error?: unknown;
  };
};

const CustomVideoFieldComponent = wrapFieldsWithMeta<object, object>(
  ({ input }: CustomVideoFieldProps) => {
    const [showPicker, setShowPicker] = React.useState(false);
    const videoUrl = typeof input.value === 'string' ? input.value : '';
    const isDirectVideo = getMediaKind(videoUrl) === 'video';

    const handleInsert = (selectedMedia: SelectedMedia[]) => {
      if (selectedMedia.length > 0) {
        input.onChange(selectedMedia[0].src);
      }
      setShowPicker(false);
    };

    return (
      <div className="relative">
        {videoUrl ? (
          <div className="group relative">
            <button
              type="button"
              onClick={() => setShowPicker(true)}
              className="flex h-48 w-full cursor-pointer items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-100 transition-opacity hover:opacity-85"
            >
              {isDirectVideo ? (
                <video
                  src={videoUrl}
                  className="h-full w-full object-contain"
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <div className="px-5 text-center">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    External video URL
                  </p>
                  <p className="break-all text-xs text-gray-500">{videoUrl}</p>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                input.onChange('');
              }}
              className="absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-none bg-white text-lg text-red-500 opacity-0 shadow-sm transition-opacity hover:bg-red-50 hover:text-red-700 group-hover:opacity-100"
              title="Remove video"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="flex h-32 w-full flex-col items-center justify-center rounded border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-blue-500 hover:text-blue-500"
          >
            <span>Select Video</span>
            <span className="mt-1 text-xs">MP4, WebM, or MOV</span>
          </button>
        )}

        <MediaPicker
          open={showPicker}
          onOpenChange={setShowPicker}
          onInsert={handleInsert}
          initialDirectory="video"
          mediaType="video"
          multiple={false}
        />
      </div>
    );
  }
);

export const CustomVideoField = CustomVideoFieldComponent as unknown as (
  props: TinaVideoComponentProps
) => React.ReactNode;
