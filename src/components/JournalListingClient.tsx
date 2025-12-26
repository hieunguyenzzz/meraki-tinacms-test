'use client';

import { useTina, tinaField } from 'tinacms/dist/react';
import { useState, useMemo, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Pagination from './Pagination';
import MerakiImage from './ui/MerakiImage';
import type { PageQuery, JournalConnectionEdges } from '../../tina/__generated__/types';
import { getThumborUrl } from '@/lib/image';

interface Props {
  data: PageQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
  journals: JournalConnectionEdges[];
}

// Helper function for translations
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

export default function JournalListingClient({
  data,
  query,
  variables,
  lang,
  journals,
}: Props) {
  const { data: tinaData } = useTina({ data, query, variables });
  const page = tinaData.page;

  // Location filter state
  const [activeLocation, setActiveLocation] = useState<string>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Available locations (should match journal schema)
  const locations = [
    'All',
    'Tà Năng',
    'Đà Lạt',
    'Quảng Ninh',
    'Nha Trang',
    'Phú Quốc',
    'Hà Nội',
    'Sapa',
  ];

  // Filter journals by location
  const filteredJournals = useMemo(() => {
    if (activeLocation === 'All') {
      return journals;
    }
    return journals.filter(
      (journal) => journal.node?.location === activeLocation
    );
  }, [activeLocation, journals]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJournals = filteredJournals.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeLocation]);

  return (
    <div className='  bg-background-base'>
      <Header lang={lang} />

      {/* Hero Section */}
      <section className='relative'>
        <div className='grid sm:grid-cols-1 lg:grid-cols-2 items-stretch'>
          {/* Left - Hero Image */}
          <div
            className='md:h-[500px] relative lg:h-full overflow-hidden'
            data-tina-field={tinaField(page.hero, 'background_image')}>
            <MerakiImage
              src={page.hero?.background_image || '/images/journal/listing/hero-image.jpg'}
              alt='Hero Background'
              fill
              className='object-cover object-center'
              priority
            />
          </div>

          {/* Right - Hero Content */}
          <div className='md:w-[540px] mx-auto md:-translate-y-20 lg:translate-y-0 lg:w-full p-20 flex flex-col gap-20 justify-between bg-paper bg-background-1 items-center text-center'>
            <h1
              className='text-display font-vocago uppercase tracking-wider'
              data-tina-field={tinaField(
                page,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}>
              {lang === 'en' ? page.title_en : page.title_vi}
            </h1>

            {/* Featured Journal Thumbnail */}
            {page.hero?.featured_thumbnail && (
              <div data-tina-field={tinaField(page.hero, 'featured_thumbnail')}>
                <MerakiImage
                  src={page.hero.featured_thumbnail}
                  alt='Featured'
                  className='w-[260px] h-auto object-cover'
                  useNativeImg={true}
                />
              </div>
            )}

            <p
              className='text-body-md text-text-secondary max-w-[500px] leading-relaxed'
              data-tina-field={tinaField(
                page.hero,
                lang === 'en' ? 'description_en' : 'description_vi'
              )}>
              {lang === 'en'
                ? page.hero?.description_en
                : page.hero?.description_vi}
            </p>
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className='md:py-0 lg:pt-20 lg:pb-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex gap-6 overflow-x-auto justify-center'>
            {locations.map((location) => (
              <button
                key={location}
                onClick={() => setActiveLocation(location)}
                className={`text-body-sm px-4 py-2 whitespace-nowrap transition-colors ${
                  activeLocation === location
                    ? 'text-text-primary bg-background-2'
                    : 'text-text-secondary hover:bg-background-1 border-b-[1px] border-text-primary'
                }`}>
                {location === 'All'
                  ? t({ en: 'All', vi: 'Tất cả' }, lang)
                  : location}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Journal Grid */}
      <section className='pb-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20'>
          {paginatedJournals.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16'>
              {paginatedJournals.map((journal, index: number) => {
                // Apply translate-y to every 2nd item in each row on desktop only (index 1, 4, 7, etc.)
                const shouldTranslate = index % 3 === 1;

                return (
                  <div
                    key={index}
                    className={`group ${
                      shouldTranslate ? 'lg:-translate-y-16' : ''
                    }`}>
                    <a href={`/${lang}/journal/${journal.node?.slug}`}>
                      {/* Image Container */}
                      <div className='relative aspect-[3/4] overflow-hidden mb-6'>
                        {journal.node?.featured_image ? (
                          <MerakiImage
                            src={getThumborUrl('400x0', journal.node.featured_image)}
                            alt={journal.node.couple_names}
                            fill
                            useNativeImg={true}
                            className='object-cover group-hover:scale-105 transition-transform duration-500'
                          />
                        ) : (
                          <div className='w-full h-full bg-background-1' />
                        )}
                      </div>

                      {/* Content */}
                      <div className='text-center space-y-2'>
                        <h3 className='text-h4 font-vocago tracking-wide'>
                          {t(
                            {
                              en:
                                journal.node?.template_layout?.main_headline_en ||
                                journal.node?.couple_names || '',
                              vi:
                                journal.node?.template_layout?.main_headline_vi ||
                                journal.node?.couple_names || '',
                            },
                            lang
                          )}
                        </h3>
                        <p className='text-body-sm text-text-secondary'>
                          {journal.node?.couple_names}
                        </p>
                      </div>
                    </a>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-16'>
              <p className='text-body-md text-text-secondary'>
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
        onPageChange={setCurrentPage}
      />

      {/* Let's Connect Section */}
      {page.lets_connect && (
        <section className='py-10 bg-background-1 bg-paper'>
          <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6'>
            <div className='flex items-center justify-center'>
              <MerakiImage
                src='/images/botanical/2.svg'
                alt='Decorative botanical element'
                className='w-[48px] h-auto'
                useNativeImg={true}
              />
            </div>

            <h2
              className='text-h2 font-vocago'
              data-tina-field={tinaField(
                page.lets_connect,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}>
              {lang === 'en'
                ? page.lets_connect.title_en
                : page.lets_connect.title_vi}
            </h2>

            <p
              className='text-body-md text-text-secondary max-w-xl mx-auto'
              data-tina-field={tinaField(
                page.lets_connect,
                lang === 'en' ? 'description_en' : 'description_vi'
              )}>
              {lang === 'en'
                ? page.lets_connect.description_en
                : page.lets_connect.description_vi}
            </p>

            <a
              href={`/${lang}${
                page.lets_connect.button_link || '/lets-connect'
              }`}
              className='inline-block text-body-md text-text-primary hover:text-text-accent transition-colors border-b border-text-primary hover:border-text-accent'
              data-tina-field={tinaField(
                page.lets_connect,
                lang === 'en' ? 'button_text_en' : 'button_text_vi'
              )}>
              {lang === 'en'
                ? page.lets_connect.button_text_en
                : page.lets_connect.button_text_vi}
            </a>
          </div>
        </section>
      )}

      <Footer lang={lang} />
    </div>
  );
}
