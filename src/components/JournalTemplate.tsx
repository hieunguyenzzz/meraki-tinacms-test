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
  
  const testimonialQuote = lang === 'vi'
    ? journal.testimonial?.quote_vi
    : journal.testimonial?.quote_en;

  return (
    <div className="bg-background-1 min-h-screen flex items-center justify-center">
      {/* Main Template Container */}
      <div className="relative w-full max-w-[1400px] mx-auto" style={{ aspectRatio: '16/20' }}>
        <div className="absolute inset-0 flex">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 relative flex flex-col">
            
            {/* Top Left image */}
            {journal.template_layout?.image_top && (
              <div 
                className="relative overflow-hidden -translate-y-1/4"
                data-tina-field={tinaField(journal.template_layout, 'image_top')}
              >
                <Image
                  src={journal.template_layout.image_top}
                  alt="Detail"
                  width={212}
                  height={381}
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Left Content Area - 75% of left column */}
            <div className="flex-1 bg-background-1 flex flex-col justify-start px-8 py-12">
              {/* Couple Names */}
              <div className="mb-12">
                <h1 
                  className="text-h1 tracking-wider text-center"
                  data-tina-field={tinaField(journal, 'couple_names')}
                  style={{ 
                    fontFamily: 'Georgia, serif',
                    fontWeight: 300
                  }}
                >
                  {journal.couple_names}
                </h1>
              </div>

              {/* Wedding Details */}
              {journal.wedding_details && (
                <div className="space-y-6 text-center mb-12">
                  {/* Nationality */}
                  {journal.wedding_details.nationality && (
                    <div data-tina-field={tinaField(journal.wedding_details, 'nationality')}>
                      <div className="text-[10px] tracking-[0.2em] mb-1 uppercase opacity-60">
                        {journal.wedding_details.nationality_label || 'NATIONALITY'}
                      </div>
                      <div className="text-sm">
                        {journal.wedding_details.nationality}
                      </div>
                    </div>
                  )}

                  {/* Wedding Location */}
                  {journal.wedding_details.location && (
                    <div data-tina-field={tinaField(journal.wedding_details, 'location')}>
                      <div className="text-[10px] tracking-[0.2em] mb-1 uppercase opacity-60">
                        {journal.wedding_details.location_label || 'WEDDING LOCATION'}
                      </div>
                      <div className="text-sm">
                        {journal.wedding_details.location}
                      </div>
                    </div>
                  )}

                  {/* Wedding Venue */}
                  {journal.wedding_details.venue && (
                    <div data-tina-field={tinaField(journal.wedding_details, 'venue')}>
                      <div className="text-[10px] tracking-[0.2em] mb-1 uppercase opacity-60">
                        {journal.wedding_details.venue_label || 'WEDDING VENUE'}
                      </div>
                      <div className="text-sm">
                        {journal.wedding_details.venue}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Main Headline */}
              {mainHeadline && (
                <div className="mb-12">
                  <h2 
                    className="text-2xl leading-tight tracking-wider text-center uppercase"
                    data-tina-field={tinaField(
                      journal.template_layout, 
                      lang === 'vi' ? 'main_headline_vi' : 'main_headline_en'
                    )}
                    style={{ 
                      fontFamily: 'Georgia, serif',
                      fontWeight: 300,
                      letterSpacing: '0.1em',
                      color: '#8B7355'
                    }}
                  >
                    {mainHeadline}
                  </h2>
                </div>
              )}

              {/* Sub image */}
              {journal.template_layout?.image_sub && (
                <div 
                  className="relative w-full overflow-hidden"
                  data-tina-field={tinaField(journal.template_layout, 'image_sub')}
                >
                  <Image
                    src={journal.template_layout.image_sub}
                    alt="Ceremony"
                    width={450}
                    height={300}
                    className="object-cover grayscale"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - fixed 587px width */}
          <div className="w-[587px] relative flex flex-col">

            {/* Main image */}
            {journal.template_layout?.image_main && (
              <div 
                className="h-[75%] relative overflow-hidden"
                data-tina-field={tinaField(journal.template_layout, 'image_main')}
              >
                <Image
                  src={journal.template_layout.image_main}
                  alt={journal.couple_names}
                  width={587}
                  height={880}
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            {/* Testimonial Section - Takes 25% of right column */}
            {journal.testimonial && (
              <div className="h-[25%] bg-background-1 flex flex-col justify-center items-center px-12 py-8">
                {/* Testimonial Heading */}
                {journal.testimonial.heading && (
                  <div 
                    className="text-[10px] tracking-[0.3em] mb-3 uppercase"
                    data-tina-field={tinaField(journal.testimonial, 'heading')}
                  >
                    {journal.testimonial.heading}
                  </div>
                )}

                {/* Decorative Script Text */}
                {journal.testimonial.decorative_text && (
                  <div 
                    className="text-lg italic mb-3 text-center"
                    data-tina-field={tinaField(journal.testimonial, 'decorative_text')}
                    style={{ 
                      fontFamily: 'Brush Script MT, cursive',
                      color: '#8B7355'
                    }}
                  >
                    {journal.testimonial.decorative_text}
                  </div>
                )}

                {/* Quote */}
                {testimonialQuote && (
                  <p 
                    className="text-center text-xs leading-relaxed max-w-lg"
                    data-tina-field={tinaField(
                      journal.testimonial,
                      lang === 'vi' ? 'quote_vi' : 'quote_en'
                    )}
                    style={{ 
                      fontSize: '11px',
                      lineHeight: '1.6'
                    }}
                  >
                    {testimonialQuote}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
