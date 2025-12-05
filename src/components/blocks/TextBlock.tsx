'use client';

import { tinaField } from 'tinacms/dist/react';

interface TextBlockData extends Record<string, unknown> {
  title_en?: string;
  title_vi?: string;
  description_en?: string;
  description_vi?: string;
  alignment?: string;
}

interface TextBlockProps {
  data: TextBlockData;
  lang: string;
}

export default function TextBlock({ data, lang }: TextBlockProps) {
  const title = lang === 'vi' ? data.title_vi : data.title_en;
  const description = lang === 'vi' ? data.description_vi : data.description_en;
  const alignment = data.alignment || 'center';
  const alignClass =
    alignment === 'left'
      ? 'text-left'
      : alignment === 'right'
      ? 'text-right'
      : 'text-center';

  return (
    <div className={`max-w-[640px] mx-auto px-8 ${alignClass}`}>
      {title && (
        <h2
          className='text-h3 mb-4'
          data-tina-field={tinaField(
            data,
            lang === 'vi' ? 'title_vi' : 'title_en'
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <p
          className='text-body-md text-text-secondary leading-relaxed whitespace-pre-line'
          data-tina-field={tinaField(
            data,
            lang === 'vi' ? 'description_vi' : 'description_en'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
