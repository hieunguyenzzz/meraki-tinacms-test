'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { tinaField } from 'tinacms/dist/react';
import Image from 'next/image';

interface JournalTemplateProps {
  journal: any;
  lang: string;
}

export default function JournalTemplate({ journal, lang }: JournalTemplateProps) {
  const mainHeadline = lang === 'vi' 
    ? journal.template_layout?.main_headline_vi 
    : journal.template_layout?.main_headline_en;

  return (
    <div className='bg-background-1  '>
      {/* Main Template Container */}
      <div className='relative w-full max-w-[1400px] mx-auto z-[1] pb-10'>
        <div className='flex'>
          {/* LEFT COLUMN */}
          <div className='flex-1 relative flex flex-col'>
            {/* Top Left image */}
            {journal.template_layout?.image_top && (
              <div
                className='relative overflow-hidden'
                data-tina-field={tinaField(
                  journal.template_layout,
                  'image_top'
                )}>
                <Image
                  src={journal.template_layout.image_top}
                  alt='Detail'
                  width={212}
                  height={381}
                  className='object-cover'
                  unoptimized
                />
              </div>
            )}

            {/* Left Content Area - 75% of left column */}
            <div className='flex-1 px-8 pt-8'>
              <div className='max-w-[464px] mx-auto flex flex-col justify-center'>
                {/* Couple Names */}
                <div className='mb-12'>
                  <h1
                    className='text-h1 tracking-wider text-center'
                    data-tina-field={tinaField(journal, 'couple_names')}>
                    {journal.couple_names}
                  </h1>
                </div>

                {/* Wedding Details */}
                {journal.wedding_details && (
                  <div className='space-y-6 text-center mb-12'>
                    {/* Nationality */}
                    {journal.wedding_details.nationality && (
                      <div
                        data-tina-field={tinaField(
                          journal.wedding_details,
                          'nationality'
                        )}>
                        <div className='text-body-sm mb-1 uppercase text-text-secondary'>
                          NATIONALITY
                        </div>
                        <div className='text-body-md'>
                          {journal.wedding_details.nationality}
                        </div>
                      </div>
                    )}

                    {/* Wedding Location */}
                    {journal.wedding_details.location && (
                      <div
                        data-tina-field={tinaField(
                          journal.wedding_details,
                          'location'
                        )}>
                        <div className='text-body-sm mb-1 uppercase text-text-secondary'>
                          WEDDING LOCATION
                        </div>
                        <div className='text-body-md'>
                          {journal.wedding_details.location}
                        </div>
                      </div>
                    )}

                    {/* Wedding Venue */}
                    {journal.wedding_details.venue && (
                      <div
                        data-tina-field={tinaField(
                          journal.wedding_details,
                          'venue'
                        )}>
                        <div className='text-body-sm mb-1 uppercase text-text-secondary'>
                          WEDDING VENUE
                        </div>
                        <div className='text-body-md'>
                          {journal.wedding_details.venue}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Main Headline */}
                {mainHeadline && (
                  <div className='mb-12'>
                    <h2
                      className='text-display text-center uppercase text-text-accent'
                      data-tina-field={tinaField(
                        journal.template_layout,
                        lang === 'vi' ? 'main_headline_vi' : 'main_headline_en'
                      )}>
                      {mainHeadline}
                    </h2>
                  </div>
                )}

                {/* Sub image */}
                {journal.template_layout?.image_sub && (
                  <div
                    className='relative w-full overflow-hidden'
                    data-tina-field={tinaField(
                      journal.template_layout,
                      'image_sub'
                    )}>
                    <Image
                      src={journal.template_layout.image_sub}
                      alt='Ceremony'
                      width={450}
                      height={300}
                      className='object-cover grayscale'
                      unoptimized
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - fixed 587px width */}
          <div className='w-[587px] relative flex flex-col'>
            {/* Main image */}
            {journal.template_layout?.image_main && (
              <div
                className='h-[75%] relative overflow-hidden'
                data-tina-field={tinaField(
                  journal.template_layout,
                  'image_main'
                )}>
                <Image
                  src={journal.template_layout.image_main}
                  alt={journal.couple_names}
                  width={587}
                  height={880}
                  className='object-cover'
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
