'use client';

import { MediaPicker } from "./MediaPicker";

interface MediaManagerScreenProps {
  close: () => void;
}

export const MediaManagerScreen = ({ close }: MediaManagerScreenProps) => {
  return (
    <MediaPicker
      open
      onOpenChange={close}
      onInsert={() => undefined}
      mode="manager"
      embedded
    />
  );
};
