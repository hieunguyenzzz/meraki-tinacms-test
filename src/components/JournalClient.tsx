'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useTina } from 'tinacms/dist/react';
import Header from './Header';
import Footer from './Footer';
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

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className='bg-background-1'>
      <Header lang={lang} />

      <JournalTemplate journal={journal} lang={lang} />

      {/* Content Blocks */}
      {journal.content_blocks && journal.content_blocks.length > 0 && (
        <ContentBlocksRenderer
          blocks={journal.content_blocks}
          lang={lang}
          typenamePrefix='JournalContent_blocks'
          indexMap={indexMap}
          onImageClick={openLightbox}
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

      <Footer lang={lang} />
    </div>
  );
}
