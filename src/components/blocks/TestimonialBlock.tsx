'use client';

import { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

interface TestimonialBlockData extends Record<string, unknown> {
  //   heading?: string;
  decorative_text_en?: string;
  decorative_text_vi?: string;
  quote_en?: string;
  quote_vi?: string;
  author?: string;
}

interface TestimonialBlockProps {
  data: TestimonialBlockData;
  lang: string;
}

export default function TestimonialBlock({
  data,
  lang,
}: TestimonialBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = (lang === 'vi' ? data.quote_vi : data.quote_en) || '';
  const decorativeText =
    (lang === 'vi' ? data.decorative_text_vi : data.decorative_text_en) || '';
  // Approx char limit (~5 lines on mobile/desktop) to allow inline "Read more"
  const MAX_LENGTH = 520;
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
    <div className="bg-paper px-4 py-20 md:px-12">
      <div className="max-w-[920px] mx-auto text-center relative">
        {/* Testimonial Heading */}
        <div className="text-h3 mb-3">
          {/* {data.heading} */}
          {lang === 'vi' ? 'Lời nhắn gửi' : 'Testimonial'}
        </div>

        {/* Decorative Script Text */}
        {decorativeText && (
          <div
            className="text-handwriting text-h4 mb-3 text-center max-w-[640px] mx-auto"
            data-tina-field={tinaField(
              data,
              lang === 'vi' ? 'decorative_text_vi' : 'decorative_text_en'
            )}
          >
            {decorativeText}
          </div>
        )}

        {/* Quote */}
        {text && (
          <p
            className="text-justify text-text-secondary text-body-sm whitespace-pre-line"
            data-tina-field={tinaField(
              data,
              lang === 'vi' ? 'quote_vi' : 'quote_en'
            )}
          >
            {!isExpanded && shouldTruncate ? (
              <>
                {truncateText(text)}
                <button
                  onClick={() => setIsExpanded(true)}
                  type="button"
                  className="inline text-text-primary text-body-sm underline hover:opacity-70 transition-opacity ml-1"
                >
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
