'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type CSSProperties,
  type TransitionEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { useUrlPagination } from '../lib/useUrlPagination';
import LoveNoteLightbox from './LoveNoteLightbox';
import styles from './LoveNotesClient.module.css';
import Pagination from './Pagination';
import MerakiImage from './ui/MerakiImage';

interface Props {
  data: any;
  query: string;
  variables: { relativePath: string };
  lang: string;
}

const t = (text: { en?: string | null; vi?: string | null }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const NOTES_PER_PAGE = 6;

const splitCoupleNames = (names?: string | null): [string, string] => {
  if (!names) return ['', ''];

  const [left, ...rightParts] = names.split(',');
  const right = rightParts.join(',').trim();

  return [left.trim(), right];
};

const getLoveNoteId = (note: any, index: number) =>
  [
    note?.couple_names_en || note?.couple_names_vi || 'love-note',
    note?.wedding_location_en || note?.wedding_location_vi || 'unknown',
    index,
  ].join('-');

export default function LoveNotesClient({
  data,
  query,
  variables,
  lang,
}: Props) {
  const [openNotes, setOpenNotes] = useState<Record<number, boolean>>({});
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(
    null
  );
  const notesSectionRef = useRef<HTMLElement | null>(null);
  const previousPageRef = useRef(1);
  const noteImageRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const pendingScrollIndex = useRef<number | null>(null);
  const { data: tinaData } = useTina({ data, query, variables });
  const listing = tinaData.loveNotesListing;

  const title =
    t({ en: listing?.title_en, vi: listing?.title_vi }, lang) ||
    (lang === 'en' ? 'Love Notes' : 'Tri an');

  const heroDescription = t(
    {
      en: listing?.hero?.description_en,
      vi: listing?.hero?.description_vi,
    },
    lang
  );

  const notes = listing?.love_notes || [];
  const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
  const { currentPage: visiblePage, setPage } = useUrlPagination(totalPages);
  const firstNoteIndex = (visiblePage - 1) * NOTES_PER_PAGE;
  const paginatedNotes = notes.slice(
    firstNoteIndex,
    firstNoteIndex + NOTES_PER_PAGE
  );
  const galleryImages = listing?.friendship_gallery?.images || [];
  const galleryTitle = t(
    {
      en: listing?.friendship_gallery?.title_en,
      vi: listing?.friendship_gallery?.title_vi,
    },
    lang
  );

  const scrollToNoteImage = (index: number) => {
    const image = noteImageRefs.current[index];
    if (!image) return;

    const headerHeight =
      document.querySelector('header')?.getBoundingClientRect().height || 0;
    const imageTop = image.getBoundingClientRect().top + window.scrollY;

    window.scrollTo({
      top: Math.max(0, imageTop - headerHeight),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  };

  const toggleNote = (index: number) => {
    const isOpening = !openNotes[index];
    if (isOpening) {
      pendingScrollIndex.current = index;
    } else if (pendingScrollIndex.current === index) {
      pendingScrollIndex.current = null;
    }

    setOpenNotes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));

    if (
      isOpening &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      requestAnimationFrame(() => {
        if (pendingScrollIndex.current === index) {
          pendingScrollIndex.current = null;
          scrollToNoteImage(index);
        }
      });
    }
  };

  const handleNotePanelTransitionEnd = (
    index: number,
    event: TransitionEvent<HTMLDivElement>
  ) => {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'max-height' ||
      pendingScrollIndex.current !== index
    ) {
      return;
    }

    pendingScrollIndex.current = null;
    scrollToNoteImage(index);
  };

  useEffect(() => {
    if (previousPageRef.current === visiblePage) return;
    previousPageRef.current = visiblePage;

    pendingScrollIndex.current = null;
    setOpenNotes({});
    setActiveLightboxIndex(null);

    requestAnimationFrame(() => {
      const section = notesSectionRef.current;
      if (!section) return;

      const headerHeight =
        document.querySelector('header')?.getBoundingClientRect().height || 0;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: Math.max(0, sectionTop - headerHeight),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
    });
  }, [visiblePage]);

  return (
    <div className="bg-background-base">
      <section className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div
            className="relative h-[500px] overflow-hidden animate__animated animate__fadeInLeft md:h-[620px] lg:h-auto lg:min-h-[620px]"
            data-tina-field={tinaField(listing.hero, 'background_image')}
          >
            <MerakiImage
              src={
                listing?.hero?.background_image ||
                '/images/bg/love-notes-hero.jpg'
              }
              alt="Love Notes hero background"
              fill
              sizes="(min-width: 1280px) 50vw, 100vw"
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="relative mx-4 -translate-y-20 bg-background-1 bg-paper px-4 py-8 md:mx-0 md:translate-y-0 md:px-16 md:py-20 lg:px-20 lg:py-24 flex flex-col items-center justify-between text-center gap-10">
            <h1
              className="text-h1 font-vocago uppercase tracking-wider md:text-display"
              data-tina-field={tinaField(
                listing,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {title}
            </h1>

            <div
              className="w-[140px] animate__animated animate__fadeInLeft md:w-[220px] lg:w-[260px]"
              data-tina-field={tinaField(listing.hero, 'featured_image')}
            >
              <MerakiImage
                src={
                  listing?.hero?.featured_image ||
                  '/images/bg/love-notes-featured.jpg'
                }
                alt="Love Notes featured"
                width={260}
                height={340}
                sizes="(min-width: 1280px) 260px, (min-width: 744px) 220px, 140px"
                className="w-full h-auto object-cover"
              />
            </div>

            {heroDescription && (
              <p
                className="text-body-md text-text-secondary max-w-[520px] leading-relaxed"
                data-tina-field={tinaField(
                  listing.hero,
                  lang === 'en' ? 'description_en' : 'description_vi'
                )}
              >
                {heroDescription}
              </p>
            )}
          </div>
        </div>
      </section>

      <section ref={notesSectionRef}>
        <div className="mx-auto mb-12 max-w-[1728px] px-4 md:px-10">
          <div
            key={`love-notes-page-${visiblePage}`}
            className="mt-12 space-y-0 md:mt-16 md:space-y-16"
          >
            {paginatedNotes.map((note: any, pageIndex: number) => {
              const index = firstNoteIndex + pageIndex;
              const coupleNames = t(
                {
                  en: note?.couple_names_en,
                  vi: note?.couple_names_vi,
                },
                lang
              );

              const location = t(
                {
                  en: note?.wedding_location_en,
                  vi: note?.wedding_location_vi,
                },
                lang
              );

              const excerpt = t(
                {
                  en: note?.excerpt_en,
                  vi: note?.excerpt_vi,
                },
                lang
              );

              const fullNote = t(
                {
                  en: note?.note_en,
                  vi: note?.note_vi,
                },
                lang
              );
              const [leftName, rightName] = splitCoupleNames(coupleNames);
              const hasRightName = Boolean(rightName);
              const isOpen = Boolean(openNotes[index]);
              const notePanelId = `love-note-panel-${index}`;
              const isRightAligned = index % 2 === 1;

              return (
                <article
                  key={getLoveNoteId(note, index)}
                  className={`flex flex-col items-center border-b border-text-primary/35 py-6 first:pt-0 md:border-0 md:py-0 lg:flex-row ${isRightAligned ? 'lg:flex-row-reverse' : ''
                    }`}
                >
                  <div
                    className={`w-full ${isRightAligned ? 'lg:max-w-[1000px]' : 'lg:max-w-[980px]'
                      }`}
                    data-tina-field={tinaField(
                      note,
                      lang === 'en' ? 'couple_names_en' : 'couple_names_vi'
                    )}
                  >
                    <div
                      className={`text-center md:text-left ${isRightAligned ? 'lg:text-right' : 'lg:text-left'
                        }`}
                    >
                      <h2
                        className={`flex flex-wrap items-center justify-center gap-x-5 gap-y-3 font-vocago text-h2 md:justify-start md:text-display ${isRightAligned ? 'lg:justify-end' : 'lg:justify-start'
                          }`}
                      >
                        <span className="uppercase">{leftName}</span>

                        <button
                          type="button"
                          onClick={() => toggleNote(index)}
                          aria-expanded={isOpen}
                          aria-controls={notePanelId}
                          className="flex h-[38px] w-[58px] shrink-0 items-end justify-center rounded-sm transition-transform duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-primary/40 md:h-[54px] md:w-[82px] lg:h-[62px] lg:w-[94px]"
                        >
                          <img
                            src={
                              isOpen
                                ? '/images/icons/envelope-open.png'
                                : '/images/icons/envelope-closed.png'
                            }
                            alt="Envelope toggle"
                            width={isOpen ? 80 : 94}
                            height={62}
                            loading="lazy"
                            className={`${isOpen ? 'w-[80px]' : 'w-[94px]'
                              } h-auto`}
                          />
                        </button>

                        <span className="uppercase">
                          {hasRightName ? rightName : ''}
                        </span>
                      </h2>

                      <div className="mt-8 hidden md:mt-10 md:block">
                        <p
                          className={`text-body-lg uppercase text-text-secondary lg:whitespace-nowrap ${isRightAligned ? 'lg:text-right' : 'lg:text-left'
                            }`}
                          data-tina-field={tinaField(
                            note,
                            lang === 'en'
                              ? 'wedding_location_en'
                              : 'wedding_location_vi'
                          )}
                        >
                          {lang === 'en' ? 'Wedding in ' : ''} {location}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    id={notePanelId}
                    aria-hidden={!isOpen}
                    onTransitionEnd={(event) =>
                      handleNotePanelTransitionEnd(index, event)
                    }
                    className={`w-full max-w-[400px] shrink-0 transition-[max-height,margin,opacity,transform] duration-700 ease-in-out motion-reduce:transition-none ${isOpen
                      ? `visible mt-8 max-h-[1200px] opacity-100 ${isRightAligned
                        ? 'lg:translate-x-[75%] xl:translate-x-[60%]'
                        : 'lg:-translate-x-[75%] xl:-translate-x-[60%]'
                      }`
                      : 'invisible my-0 max-h-0 overflow-hidden opacity-0'
                      }`}
                  >
                    <div className="relative">
                      {/* Image base layer */}
                      <div
                        ref={(element) => {
                          noteImageRefs.current[index] = element;
                        }}
                        data-tina-field={tinaField(note, 'image')}
                      >
                        <div
                          className={`relative overflow-visible animate__animated animate__faster ${isOpen
                            ? isRightAligned
                              ? 'animate__fadeInRight'
                              : 'animate__fadeInLeft'
                            : ''
                            }`}
                        >
                          <MerakiImage
                            src={
                              note?.image ||
                              '/images/bg/love-notes-featured.jpg'
                            }
                            alt={coupleNames || 'Couple note image'}
                            width={400}
                            height={592}
                            sizes="(min-width: 744px) 400px, calc(100vw - 32px)"
                            className="h-auto w-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Note card overlay */}
                      {fullNote &&
                        (() => {
                          const isNoteLong = fullNote.length > 280;

                          return (
                            <div
                              className={`animate__animated animate__faster ${isOpen
                                ? isRightAligned
                                  ? 'animate__fadeInLeft'
                                  : 'animate__fadeInRight'
                                : ''
                                } z-10 relative -mt-11 w-[calc(100%-3rem)] bg-background-1 bg-paper p-6 text-center md:-mt-[300px] md:w-[446px] md:p-8 ${!isRightAligned
                                  ? 'ml-auto right-0 md:ml-0 md:right-auto md:left-[290px]'
                                  : 'mr-auto left-0 md:mr-0 md:right-[340px] md:left-auto'
                                }`}
                            >
                              {/* Couple Names */}
                              <h3
                                className="text-h3 uppercase tracking-wide text-text-primary mb-1"
                                data-tina-field={tinaField(
                                  note,
                                  lang === 'en'
                                    ? 'couple_names_en'
                                    : 'couple_names_vi'
                                )}
                              >
                                <span>{leftName}</span>
                                {hasRightName && (
                                  <>
                                    <span className="lowercase text-body-lg font-normal">
                                      {' '}
                                      &{' '}
                                    </span>
                                    <span>{rightName}</span>
                                  </>
                                )}
                              </h3>

                              {/* Botanical Leaf Icon */}
                              <div className="flex justify-center mb-3">
                                <img
                                  src="/images/botanical/2.svg"
                                  alt="Decorative leaf"
                                  className="h-5 w-auto opacity-75"
                                />
                              </div>

                              {/* Excerpt in handwriting font */}
                              {excerpt && (
                                <p
                                  className="text-handwriting italic text-text-primary mb-4 leading-relaxed"
                                  data-tina-field={tinaField(
                                    note,
                                    lang === 'en' ? 'excerpt_en' : 'excerpt_vi'
                                  )}
                                >
                                  {excerpt}
                                </p>
                              )}

                              {/* Note Content (CSS line-clamped to 8 lines) */}
                              <p
                                className="text-body-sm text-text-secondary leading-relaxed overflow-hidden"
                                style={{
                                  display: '-webkit-box',
                                  WebkitLineClamp: 8,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }}
                                data-tina-field={tinaField(
                                  note,
                                  lang === 'en' ? 'note_en' : 'note_vi'
                                )}
                              >
                                {fullNote}
                              </p>

                              {/* View More Button if note is long */}
                              {isNoteLong && (
                                <div className="mt-5 mb-2 flex flex-col items-center gap-4">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setActiveLightboxIndex(index)
                                    }
                                    className="text-body-lg text-text-primary hover:opacity-75 transition-opacity cursor-pointer focus:outline-none font-vocago tracking-wide"
                                  >
                                    {lang === 'en' ? 'View more' : 'Xem thêm'}
                                  </button>
                                  <div className="w-44 h-[1.5px] bg-[#838d4c]/70" />
                                </div>
                              )}

                              {!isNoteLong && (
                                <div className="w-32 h-[1px] bg-text-primary/30 mx-auto my-4" />
                              )}

                              {/* Wedding Location */}
                              {location && (
                                <p
                                  className="text-body-sm uppercase tracking-[0.16em] text-text-secondary font-medium"
                                  data-tina-field={tinaField(
                                    note,
                                    lang === 'en'
                                      ? 'wedding_location_en'
                                      : 'wedding_location_vi'
                                  )}
                                >
                                  {lang === 'en'
                                    ? 'WEDDING IN '
                                    : 'TỔ CHỨC TẠI '}{' '}
                                  {location}
                                </p>
                              )}
                            </div>
                          );
                        })()}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleNote(index)}
                    aria-expanded={isOpen}
                    aria-controls={notePanelId}
                    className="mt-5 flex h-6 w-10 items-center justify-center text-text-primary md:hidden"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                        }`}
                    >
                      <path
                        d="m7 10 5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeWidth="2"
                      />
                    </svg>
                    <span className="sr-only">
                      {isOpen ? 'Close love note' : 'Open love note'}
                    </span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <Pagination
        currentPage={visiblePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      {galleryImages.length > 0 && (
        <section className="py-14 md:py-20 bg-background-1">
          <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
            {galleryTitle && (
              <h2
                className="text-h2 md:text-display font-vocago text-center mb-10 md:mb-14"
                data-tina-field={tinaField(
                  listing.friendship_gallery,
                  lang === 'en' ? 'title_en' : 'title_vi'
                )}
              >
                {galleryTitle}
              </h2>
            )}
          </div>

          <div
            className={`${styles.friendshipViewport} w-full px-4 md:px-0`}
            data-tina-field={tinaField(listing.friendship_gallery, 'images')}
          >
            <div
              className={styles.friendshipTrack}
              style={
                {
                  '--carousel-duration': `${Math.max(
                    24,
                    galleryImages.length * 6
                  )}s`,
                } as CSSProperties
              }
            >
              <div className={styles.friendshipGroup}>
                {galleryImages.map((image: string, index: number) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[4/5] w-[calc(100vw-2rem)] shrink-0 overflow-hidden md:w-[32vw] md:max-w-[360px] lg:w-[270px] xl:w-[300px]"
                  >
                    <MerakiImage
                      src={image}
                      alt={`Friendship memory ${index + 1}`}
                      fill
                      sizes="(min-width: 1280px) 300px, (min-width: 744px) 32vw, calc(100vw - 32px)"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <div
                className={`${styles.friendshipGroup} ${styles.friendshipDuplicate}`}
                aria-hidden="true"
              >
                {galleryImages.map((image: string, index: number) => (
                  <div
                    key={`duplicate-${image}-${index}`}
                    className="relative aspect-[4/5] w-[calc(100vw-2rem)] shrink-0 overflow-hidden md:w-[32vw] md:max-w-[360px] lg:w-[270px] xl:w-[300px]"
                  >
                    <MerakiImage
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 300px, (min-width: 744px) 32vw, calc(100vw - 32px)"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <LoveNoteLightbox
        note={activeLightboxIndex !== null ? notes[activeLightboxIndex] : null}
        isOpen={activeLightboxIndex !== null}
        onClose={() => setActiveLightboxIndex(null)}
        lang={lang}
      />
    </div>
  );
}
