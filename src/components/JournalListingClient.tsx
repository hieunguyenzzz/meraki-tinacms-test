/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import type {
  JournalConnectionEdges,
  JournalListingQuery,
} from '../../tina/__generated__/types';
import {
  LISTING_PAGE_SIZE,
  listingPageUrl,
} from '../lib/listingPagination';
import { useUrlPagination } from '../lib/useUrlPagination';
import Pagination from './Pagination';
import MerakiImage from './ui/MerakiImage';

interface Props {
  data: JournalListingQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
  journals: JournalConnectionEdges[];
  initialPage: number;
}

// Helper function for translations
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const getJournalId = (journal: JournalConnectionEdges) =>
  journal.node?.id ||
  journal.node?._sys?.relativePath ||
  journal.node?.slug ||
  journal.cursor;

export default function JournalListingClient({
  data,
  query,
  variables,
  lang,
  journals,
  initialPage,
}: Props) {
  const { data: tinaData } = useTina({ data, query, variables });
  const listing = tinaData.journalListing;

  // Location filter state
  const [activeLocation, setActiveLocation] = useState<string>('All');

  const listSectionRef = useRef<HTMLElement | null>(null);
  const previousPageRef = useRef(initialPage);
  const itemsPerPage = LISTING_PAGE_SIZE;

  // Available locations
  const locations = useMemo(() => {
    const filters = listing.location_filters || [];
    const allLabel = t({ en: 'All', vi: 'Tất cả' }, lang);

    return [
      { label: allLabel, value: 'All' },
      ...filters.map((f) => ({ label: f?.value, value: f?.value })),
    ];
  }, [listing, lang]);

  // Filter and sort journals by location and custom ordering
  const filteredJournals = useMemo(() => {
    // 1. Filter pool by location
    const pool =
      activeLocation === 'All'
        ? journals
        : journals.filter(
          (journal) => journal.node?.location === activeLocation
        );

    // 2. Extract saved order array for active location
    const ordering = (listing as any)?.journal_ordering;
    let customOrderSlugs: string[] = [];

    if (activeLocation === 'All') {
      customOrderSlugs =
        (ordering?.order_all?.filter(Boolean) as string[]) || [];
    } else {
      const locObj = (ordering?.location_orders || []).find(
        (l: any) => l?.location === activeLocation
      );
      customOrderSlugs = (locObj?.order?.filter(Boolean) as string[]) || [];
    }

    // Map for fast index lookup
    const slugOrderMap = new Map<string, number>();
    customOrderSlugs.forEach((slug, index) => {
      slugOrderMap.set(slug, index);
    });

    const explicitlyOrdered: typeof pool = [];
    const unlisted: typeof pool = [];

    pool.forEach((item) => {
      const slug = item.node?.slug || item.node?._sys?.filename || '';
      const relativePath = item.node?._sys?.relativePath || '';

      let orderIdx = slugOrderMap.get(slug);
      if (orderIdx === undefined && relativePath) {
        orderIdx = slugOrderMap.get(relativePath);
      }

      if (orderIdx !== undefined) {
        explicitlyOrdered.push(item);
      } else {
        unlisted.push(item);
      }
    });

    // Sort explicitly ordered items according to position in customOrderSlugs
    explicitlyOrdered.sort((a, b) => {
      const slugA = a.node?.slug || a.node?._sys?.filename || '';
      const slugB = b.node?.slug || b.node?._sys?.filename || '';
      const idxA =
        slugOrderMap.get(slugA) ??
        slugOrderMap.get(a.node?._sys?.relativePath || '') ??
        9999;
      const idxB =
        slugOrderMap.get(slugB) ??
        slugOrderMap.get(b.node?._sys?.relativePath || '') ??
        9999;
      return idxA - idxB;
    });

    // Sort unlisted items by fileDate descending (newest date first)
    unlisted.sort(
      (a, b) => ((b as any).fileDate || 0) - ((a as any).fileDate || 0)
    );

    return [...explicitlyOrdered, ...unlisted];
  }, [activeLocation, journals, listing]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage);
  const { currentPage, resetPage, setPage } = useUrlPagination(
    totalPages,
    initialPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJournals = filteredJournals.slice(startIndex, endIndex);

  useEffect(() => {
    if (previousPageRef.current === currentPage) return;
    previousPageRef.current = currentPage;

    requestAnimationFrame(() => {
      const section = listSectionRef.current;
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
  }, [currentPage]);

  return (
    <div className="bg-background-base">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-2">
          {/* Left - Hero Image */}
          <div
            className="animate__animated animate__fadeInLeft relative aspect-[375/368] overflow-hidden md:h-[500px] md:aspect-auto lg:h-full"
            data-tina-field={tinaField(listing.hero, 'background_image')}
          >
            <MerakiImage
              src={
                listing.hero?.background_image ||
                '/images/journal/listing/hero-image.jpg'
              }
              alt="Hero Background"
              fill
              className="object-cover object-center"
              sizes="(min-width: 1280px) 50vw, 100vw"
              priority
            />
          </div>

          {/* Right - Hero Content */}
          <div className="bg-paper mx-3 flex flex-col items-center justify-between gap-8 bg-background-1 px-4 py-8 text-center -translate-y-20 md:mx-auto md:w-[540px] md:-translate-y-20 md:gap-20 md:p-20 lg:w-full lg:translate-y-0">
            <h1
              className="text-display font-vocago uppercase tracking-wider"
              data-tina-field={tinaField(
                listing,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {lang === 'en' ? listing.title_en : listing.title_vi}
            </h1>

            {/* Featured Journal Thumbnail */}
            {listing.hero?.featured_thumbnail && (
              <div
                className="animate__animated animate__fadeInLeft"
                data-tina-field={tinaField(listing.hero, 'featured_thumbnail')}
              >
                <MerakiImage
                  src={listing.hero.featured_thumbnail}
                  alt="Featured"
                  className="h-auto w-[140px] object-cover md:w-[260px]"
                  width={260}
                  sizes="(min-width: 744px) 260px, 140px"
                />
              </div>
            )}

            <p
              className="text-body-md text-text-secondary max-w-[500px] leading-relaxed"
              data-tina-field={tinaField(
                listing.hero,
                lang === 'en' ? 'description_en' : 'description_vi'
              )}
            >
              {lang === 'en'
                ? listing.hero?.description_en
                : listing.hero?.description_vi}
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-6 md:py-0 lg:pb-10 lg:pt-20">
        <div className="mx-auto max-w-7xl md:px-6 lg:px-8">
          <div className="flex justify-start gap-1 overflow-x-auto px-4 [scrollbar-width:none] md:justify-center md:gap-6 md:px-0 [&::-webkit-scrollbar]:hidden">
            {locations.map((location) => (
              <button
                key={location.value}
                onClick={() => {
                  setActiveLocation(location?.value ?? 'All');
                  resetPage();
                }}
                className={`text-body-sm whitespace-nowrap px-3 py-2 transition-colors md:px-4 ${activeLocation === location.value
                    ? 'text-text-primary bg-background-2'
                    : 'text-text-secondary hover:bg-background-1 border-b-[1px] border-text-primary'
                  }`}
              >
                {location.value}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Grid */}
      <section ref={listSectionRef} className="pb-10">
        <div className="mx-auto mt-8 max-w-7xl px-4 md:mt-20 md:px-6 lg:px-8">
          {paginatedJournals.length > 0 ? (
            <div
              key={`journal-page-${currentPage}`}
              className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:grid-cols-3"
            >
              {paginatedJournals.map((journal, index: number) => {
                // Apply translate-y to every 2nd item in each row on desktop only (index 1, 4, 7, etc.)
                const shouldTranslate = index % 3 === 1;

                return (
                  <div
                    key={getJournalId(journal)}
                    className={`group ${shouldTranslate ? 'lg:-translate-y-16' : ''
                      }`}
                  >
                    <a href={`/${lang}/journal/${journal.node?.slug}`}>
                      {/* Image Container */}
                      <div className="relative aspect-[3/4] overflow-hidden mb-6">
                        {journal.node?.featured_image ? (
                          <MerakiImage
                            src={journal.node.featured_image}
                            alt={journal.node.couple_names}
                            fill
                            sizes="(min-width: 1280px) 384px, (min-width: 744px) calc(50vw - 40px), calc(100vw - 32px)"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-background-1" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="text-center space-y-2">
                        <h3 className="text-h4 font-vocago tracking-wide uppercase">
                          {t(
                            {
                              en:
                                journal.node?.template_layout
                                  ?.main_headline_en ||
                                journal.node?.couple_names ||
                                '',
                              vi:
                                journal.node?.template_layout
                                  ?.main_headline_vi ||
                                journal.node?.couple_names ||
                                '',
                            },
                            lang
                          )}
                        </h3>
                        <p className="text-body-sm text-text-secondary">
                          {journal.node?.couple_names}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-body-md text-text-secondary">
                {activeLocation === 'All'
                  ? t(
                    {
                      en: 'No wedding journals available yet. Check back soon!',
                      vi: 'Chưa có nhật ký cưới nào. Hãy quay lại sau!',
                    },
                    lang
                  )
                  : t(
                    {
                      en: `No wedding journals found for ${activeLocation}.`,
                      vi: `Không tìm thấy nhật ký cưới nào cho ${activeLocation}.`,
                    },
                    lang
                  )}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setPage}
        buildHref={(page) => listingPageUrl(`/${lang}/journal`, page)}
      />

      {/* Let's Connect Section */}
      {listing.lets_connect && (
        <section className="py-10 bg-background-1 bg-paper">
          <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-6">
            <div className="flex items-center justify-center">
              <MerakiImage
                src="/images/botanical/2.svg"
                alt="Decorative botanical element"
                className="w-[48px] h-auto"
                width={48}
              />
            </div>

            <h2
              className="text-h2 font-vocago"
              data-tina-field={tinaField(
                listing.lets_connect,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {lang === 'en'
                ? listing.lets_connect.title_en
                : listing.lets_connect.title_vi}
            </h2>

            <p
              className="text-body-md text-text-secondary max-w-xl mx-auto"
              data-tina-field={tinaField(
                listing.lets_connect,
                lang === 'en' ? 'description_en' : 'description_vi'
              )}
            >
              {lang === 'en'
                ? listing.lets_connect.description_en
                : listing.lets_connect.description_vi}
            </p>

            <a
              href={`/${lang}${listing.lets_connect.button_link || '/lets-connect'
                }`}
              className="inline-block text-body-md text-text-primary hover:text-text-accent transition-colors border-b border-text-primary hover:border-text-accent"
              data-tina-field={tinaField(
                listing.lets_connect,
                lang === 'en' ? 'button_text_en' : 'button_text_vi'
              )}
            >
              {lang === 'en'
                ? listing.lets_connect.button_text_en
                : listing.lets_connect.button_text_vi}
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
