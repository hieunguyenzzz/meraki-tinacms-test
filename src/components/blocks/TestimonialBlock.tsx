'use client';

import { tinaField } from 'tinacms/dist/react';
import { useState } from 'react';

interface TestimonialBlockData extends Record<string, unknown> {
//   heading?: string;
  decorative_text?: string;
  quote_en?: string;
  quote_vi?: string;
  author?: string;
}

interface TestimonialBlockProps {
  data: TestimonialBlockData;
  lang: string;
}

export default function TestimonialBlock({ data, lang }: TestimonialBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const text = (lang === 'vi' ? data.quote_vi : data.quote_en) || '';
  // Approx char limit (~5 lines on mobile/desktop) to allow inline "Read more"
  const MAX_LENGTH = 280; 
  const shouldTruncate = text.length > MAX_LENGTH;

  const truncateText = (str: string) => {
    if (!shouldTruncate) return str;
    // Find last space before limit to avoid cutting words
    const sub = str.slice(0, MAX_LENGTH);
    const lastSpace = sub.lastIndexOf(' ');
    // Handle case where no space is found (very long word)
    return sub.slice(0, lastSpace > 0 ? lastSpace : MAX_LENGTH) + '...';
  };

  return (
    <div className='bg-paper px-12 py-20'>
      <div className='max-w-[446px] mx-auto text-center relative'>
        {/* Testimonial Heading */}
        <div 
        className='text-h3 mb-3'
        data-tina-field={tinaField(data, 'heading')}
        >
        {/* {data.heading} */}
        Testimonial
        </div>

        {/* Decorative Script Text */}
        {data.decorative_text && (
          <div
            className='text-handwriting text-h4 mb-3 text-center'
            data-tina-field={tinaField(data, 'decorative_text')}>
            {data.decorative_text}
          </div>
        )}

        {/* Quote */}
        {text && (
          <p
            className='text-center text-text-secondary text-body-sm'
            data-tina-field={tinaField(
              data,
              lang === 'vi' ? 'quote_vi' : 'quote_en'
            )}>
            {!isExpanded && shouldTruncate ? (
              <>
                {truncateText(text)}
                <button
                  onClick={() => setIsExpanded(true)}
                  type='button'
                  className='inline text-text-primary text-body-sm underline hover:opacity-70 transition-opacity ml-1'>
                  {lang === 'vi' ? 'Xem thêm' : 'Read more'}
                </button>
              </>
            ) : (
              text
            )}
          </p>
        )}

        {/* Author */}
        {/* {data.author && (
          <div 
            className='mt-4 text-body-sm font-medium'
            data-tina-field={tinaField(data, 'author')}
          >
            {data.author}
          </div>
        )} */}
      </div>
    </div>
  );
}
