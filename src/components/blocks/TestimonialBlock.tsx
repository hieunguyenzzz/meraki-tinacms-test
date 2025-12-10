'use client';

import { tinaField } from 'tinacms/dist/react';

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
  return (
    <div className='bg-paper px-12 py-20'>
      <div className='max-w-[446px] mx-auto text-center'>
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
        {(lang === 'vi' ? data.quote_vi : data.quote_en) && (
          <p
            className='text-center text-text-secondary text-body-sm'
            data-tina-field={tinaField(
              data,
              lang === 'vi' ? 'quote_vi' : 'quote_en'
            )}>
            {lang === 'vi' ? data.quote_vi : data.quote_en}
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
