'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown } from 'tinacms/dist/rich-text';

interface TextBlockData extends Record<string, unknown> {
  title_en?: string;
  title_vi?: string;
  description_en?: any;
  description_vi?: any;
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
    <div className={`max-w-[968px] mx-auto px-6`}>
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
      {!!description && (
        <div
          className={`${columnClass} ${columns === 1 ? alignClass : ''}`}
          data-tina-field={tinaField(
            data,
            lang === 'vi' ? 'description_vi' : 'description_en'
          )}
        >
          <TinaMarkdown 
            content={description}
            components={{
              p: (props: any) => (
                <p className="text-body-md text-text-secondary leading-relaxed mb-2 last:mb-0" {...props} />
              ),
              bold: (props: any) => <strong className="font-bold" {...props} />,
              italic: (props: any) => <em className="italic" {...props} />,
              a: ({url, children}: any) => (
                <a className="underline hover:opacity-70 transition-opacity" target="_blank" href={url} rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}
