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
  const columnLayout = data.columnLayout || '1';
  
  const isTitleLeft = columnLayout === 'title-left';
  const columns = parseInt(columnLayout);

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

  const renderDescription = () => (
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
  );

  return (
    <div className={`max-w-[968px] mx-auto px-6`}>
      {isTitleLeft ? (
        <div className="flex flex-col md:flex-row md:gap-12 md:items-center">
           {title && (
            <div className="md:flex-1 flex-shrink-0">
               <h2
                className={`text-h3 mb-4 md:mb-0 text-left`}
                data-tina-field={tinaField(
                  data,
                  lang === 'vi' ? 'title_vi' : 'title_en'
                )}
              >
                {title}
              </h2>
            </div>
           )}
           {!!description && (
            <div 
              className="md:flex-1"
              data-tina-field={tinaField(
                data,
                lang === 'vi' ? 'description_vi' : 'description_en'
              )}
            >
              {renderDescription()}
            </div>
           )}
        </div>
      ) : (
        <>
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
              {renderDescription()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
