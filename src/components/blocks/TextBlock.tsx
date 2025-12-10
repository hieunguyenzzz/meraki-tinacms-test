'use client';

import { tinaField } from 'tinacms/dist/react';

interface TextBlockData extends Record<string, unknown> {
  title_en?: string;
  title_vi?: string;
  description_en?: string;
  description_vi?: string;
  alignment?: string;
  columnLayout?: string;
}

interface TextBlockProps {
  data: TextBlockData;
  lang: string;
}

export default function TextBlock({ data, lang }: TextBlockProps) {
  const title = lang === 'vi' ? data.title_vi : data.title_en;
  const description = lang === 'vi' ? data.description_vi : data.description_en;
  const alignment = data.alignment || 'center';
  const columns = parseInt(data.columnLayout || '1');
  const alignClass =
    alignment === 'left'
      ? 'text-left'
      : alignment === 'right'
      ? 'text-right'
      : 'text-center';
  const columnClass =
    columns === 2
      ? 'md:columns-2'
      : columns === 3
      ? 'md:columns-3'
      : '';

  return (
    <div className={`max-w-[960px] mx-auto px-8`}>
      {title && (
        <h2
          className={`text-h3 mb-4 ${alignClass}`}
          data-tina-field={tinaField(
            data,
            lang === 'vi' ? 'title_vi' : 'title_en'
          )}
        >
          {title}
        </h2>
      )}
      {description && (
        <div
          className={columnClass}
          data-tina-field={tinaField(
            data,
            lang === 'vi' ? 'description_vi' : 'description_en'
          )}
        >
          <p className='text-body-md text-text-secondary leading-relaxed whitespace-pre-line'>
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
