'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { trackEvent } from '@/lib/analytics';
import { journalAltFallback } from '@/lib/image-alt';
import { useMemo, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import JournalTemplate from './JournalTemplate';
import Lightbox from './Lightbox';
import ContentBlocksRenderer, { collectLightboxImages } from './ContentBlocksRenderer';

interface JournalClientProps {
  data: any;
  variables: any;
  query: string;
  lang: string;
  slug: string;
}

export default function JournalClient({
  data,
  variables,
  query,
  lang,
  slug,
}: JournalClientProps) {
  const { data: tinaData } = useTina({ data, variables, query });
  const journal = tinaData.journal;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { allImages, indexMap } = useMemo(() => {
    return collectLightboxImages(
      journal.content_blocks || [],
      'JournalContent_blocks',
    );
  }, [journal.content_blocks]);

  const altFallback = useMemo(() => journalAltFallback(journal), [journal]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    // Only on open — paging through the gallery would drown out the signal.
    trackEvent('lightbox_open', {
      content_type: 'journal',
      slug,
      position: index + 1,
    });
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className='bg-background-1'>
      <JournalTemplate journal={journal} lang={lang} />

      {/* Content Blocks */}
      {journal.content_blocks && journal.content_blocks.length > 0 && (
        <ContentBlocksRenderer
          blocks={journal.content_blocks}
          lang={lang}
          typenamePrefix='JournalContent_blocks'
          indexMap={indexMap}
          onImageClick={openLightbox}
          altFallback={altFallback}
        />
      )}

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        isOpen={lightboxOpen}
        currentIndex={currentIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
        lang={lang}
      />

    </div>
  );
}
