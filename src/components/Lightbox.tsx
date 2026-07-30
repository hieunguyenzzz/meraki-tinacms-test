import { useEffect, useRef, useState } from "react";
import MerakiImage from "./ui/MerakiImage";

interface LightboxProps {
  images: Array<{
    image: string;
    thumbnail?: string;
    alt_en?: string;
    alt_vi?: string;
  }>;
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  lang: string;
}

export default function Lightbox({ 
  images, 
  isOpen, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev, 
  lang 
}: LightboxProps) {
  const touchStartX = useRef<number | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const [loadedThumbnail, setLoadedThumbnail] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          onPrev();
          break;
        case "ArrowRight":
          onNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, onClose, onNext, onPrev]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    const SWIPE_THRESHOLD = 50;

    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        onNext(); // Swipe left -> next image
      } else {
        onPrev(); // Swipe right -> previous image
      }
    }
    
    touchStartX.current = null;
  };

  if (!isOpen || !images[currentIndex]) return null;

  const currentImage = images[currentIndex];
  const altText = lang === "en" ? currentImage.alt_en : currentImage.alt_vi;
  const imgLoaded = loadedImage === currentImage.image;
  const thumbnailLoaded =
    loadedThumbnail === currentImage.thumbnail && !imgLoaded;

  return (
    <div 
      className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center'
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10'
        aria-label='Close lightbox'>
        ✕
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className='absolute left-4 text-white text-3xl hover:text-gray-300 z-10'
            aria-label='Previous image'>
            ‹
          </button>
          <button
            onClick={onNext}
            className='absolute right-4 text-white text-3xl hover:text-gray-300 z-10'
            aria-label='Next image'>
            ›
          </button>
        </>
      )}

      {/* Main Image */}
      <div className='relative flex h-full w-full items-center justify-center p-4'>
        <div className='relative h-full w-full'>
          {/* Low-resolution placeholder. Its viewport-sized box remains stable
              while the browser discovers the image's intrinsic ratio. */}
          {currentImage.thumbnail && (
            <MerakiImage
              src={currentImage.thumbnail}
              alt=''
              aria-hidden='true'
              className={`absolute inset-0 h-full w-full object-contain blur-sm transition-opacity duration-300 ${
                thumbnailLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              width={75}
              sizes='100vw'
              onLoad={() => setLoadedThumbnail(currentImage.thumbnail || null)}
            />
          )}

          <MerakiImage
            src={currentImage.image}
            alt={altText || 'Gallery image'}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-300 ${
              imgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            width={1200}
            sizes='100vw'
            priority
            onLoad={() => setLoadedImage(currentImage.image)}
          />
        </div>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm'>
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Click Outside to Close */}
      <div
        className='absolute inset-0 -z-10'
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClose();
          }
        }}
        role='button'
        tabIndex={0}
        aria-label='Close lightbox'
      />
    </div>
  );
}
