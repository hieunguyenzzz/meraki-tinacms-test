'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { tinaField } from 'tinacms/dist/react';
import { renderRichTextBlock } from './RichTextBlock';

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
  defaultAlignment?: 'left' | 'center' | 'right';
}

export default function TextBlock({
  data,
  lang,
  defaultAlignment = 'center',
}: TextBlockProps) {
  const title = lang === 'vi' ? data.title_vi : data.title_en;
  const description = lang === 'vi' ? data.description_vi : data.description_en;
  const alignment = data.alignment || defaultAlignment;
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
              {renderRichTextBlock(description)}
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
              {renderRichTextBlock(description)}
            </div>
          )}
        </>
      )}
    </div>
  );
}
