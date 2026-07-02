'use client';

import { useEffect, useRef } from 'react';
import MerakiImage from './ui/MerakiImage';

interface LoveNoteItem {
  couple_names_en?: string | null;
  couple_names_vi?: string | null;
  wedding_location_en?: string | null;
  wedding_location_vi?: string | null;
  image?: string | null;
  excerpt_en?: string | null;
  excerpt_vi?: string | null;
  note_en?: string | null;
  note_vi?: string | null;
}

interface LoveNoteLightboxProps {
  note: LoveNoteItem | null;
  isOpen: boolean;
  onClose: () => void;
  lang: string;
}

const t = (text: { en?: string | null; vi?: string | null }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const splitCoupleNames = (names?: string | null): [string, string] => {
  if (!names) return ['', ''];
  const [left, ...rightParts] = names.split(',');
  const right = rightParts.join(',').trim();
  return [left.trim(), right];
};

export default function LoveNoteLightbox({
  note,
  isOpen,
  onClose,
  lang,
}: LoveNoteLightboxProps) {
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Keyboard navigation (ESC key to close)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onClose]);

  if (!isOpen || !note) return null;

  const coupleNames = t(
    { en: note.couple_names_en, vi: note.couple_names_vi },
    lang,
  );
  const location = t(
    { en: note.wedding_location_en, vi: note.wedding_location_vi },
    lang,
  );
  const excerpt = t({ en: note.excerpt_en, vi: note.excerpt_vi }, lang);
  const fullNote = t({ en: note.note_en, vi: note.note_vi }, lang);

  const [leftName, rightName] = splitCoupleNames(coupleNames);
  const hasRightName = Boolean(rightName);

  return (
    <div className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 md:p-8 animate__animated animate__fadeIn animate__faster'>
      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 md:top-6 md:right-6 text-white hover:text-gray-300 text-3xl font-light z-20 transition-colors cursor-pointer focus:outline-none'
        aria-label='Close lightbox'>
        ✕
      </button>

      {/* Main Lightbox Modal Box */}
      <div
        ref={modalRef}
        className='relative z-10 w-full max-w-[1280px] h-[796px] max-h-[90vh] bg-background-1 bg-paper flex flex-col md:flex-row rounded-md overflow-hidden shadow-2xl my-auto'>
        {/* Left Side: Couple Image (Desktop Only) */}
        {note.image && (
          <div className='hidden md:block md:w-1/2 relative bg-neutral-900 overflow-hidden h-full min-h-[480px]'>
            <MerakiImage
              src={note.image}
              alt={coupleNames || 'Couple image'}
              fill
              className='object-cover object-center'
              priority
              sizes='(max-width: 768px) 100vw, 50vw'
            />
          </div>
        )}

        {/* Right Side (Full Width on Mobile): Scrollable Note Card */}
        <div className='w-full md:w-1/2 flex flex-col h-full relative bg-background-1 bg-paper text-center overflow-hidden'>
          {/* Sticky Header */}
          <div className='sticky top-0 z-10 pt-8 pb-3 px-6 md:px-8'>
            <h3 className='text-h3 font-vocago uppercase tracking-wide text-text-primary'>
              <span>{leftName}</span>
              {hasRightName && (
                <>
                  <span className='lowercase text-body-lg font-normal'> & </span>
                  <span>{rightName}</span>
                </>
              )}
            </h3>
            <div className='flex justify-center mt-2'>
              <img
                src='/images/botanical/2.svg'
                alt='Decorative leaf'
                className='h-6 w-auto opacity-80'
              />
            </div>
          </div>

          {/* Scrollable Middle Content */}
          <div className='flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-4 custom-scrollbar text-center'>
            {/* Handwriting Excerpt */}
            {excerpt && (
              <p className='text-handwriting italic text-text-primary text-2xl md:text-3xl leading-relaxed mb-4'>
                {excerpt}
              </p>
            )}

            {/* Note Body Content */}
            {fullNote && (
              <div className='text-body-sm md:text-body-md text-text-secondary leading-relaxed space-y-4 whitespace-pre-line text-left md:text-center'>
                {fullNote}
              </div>
            )}
          </div>

          {/* Sticky Footer */}
          {location && (
            <div className='sticky bottom-0 z-10 pb-8 pt-4 px-6 md:px-8'>
              <p className='text-body-md uppercase tracking-[0.16em] text-text-secondary font-medium'>
                {lang === 'en' ? 'Wedding in ' : 'Tổ chức tại '} {location}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop Click Outside to Close */}
      <div
        className='absolute inset-0 z-0'
        onClick={onClose}
        aria-label='Close lightbox'
      />
    </div>
  );
}
