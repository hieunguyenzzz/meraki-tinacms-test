'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { tinaField } from 'tinacms/dist/react';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';

interface RichTextBlockData extends Record<string, unknown> {
  content_en?: any;
  content_vi?: any;
}

interface RichTextBlockProps {
  data: RichTextBlockData;
  lang: string;
}

export const renderRichTextBlock = (content: TinaMarkdownContent | TinaMarkdownContent[]) => (
  <TinaMarkdown
    content={content}
    components={{
      h1: (props: any) => (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h1 className={`text-h1 mb-4`} {...props} />
      ),
      h2: (props: any) => (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h2 className={`text-h2 mb-4`} {...props} />
      ),
      h3: (props: any) => (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h3 className={`text-h3 mb-4`} {...props} />
      ),
      h4: (props: any) => (
        // eslint-disable-next-line jsx-a11y/heading-has-content
        <h4 className={`text-h4 mb-4`} {...props} />
      ),
      p: (props: any) => (
        <p className="text-body-md text-text-secondary leading-relaxed mb-2 last:mb-0" {...props} />
      ),
      img: ({ alt, url }: any) => (
        <img
          src={url}
          alt={alt}
          className="my-4 max-w-full h-auto" />
      ),
      bold: (props: any) => <strong className="font-bold" {...props} />,
      italic: (props: any) => <em className="italic" {...props} />,
      a: ({ url, children }: any) => (
        <a className="underline hover:opacity-70 transition-opacity" target="_blank" href={url} rel="noopener noreferrer">
          {children}
        </a>
      ),
    }}
  />
);

export default function RichTextBlock({ data, lang }: RichTextBlockProps) {
  const content = lang === 'vi' ? data.content_vi : data.content_en;

  if (!content) {
    return null;
  }

  return (
    <div className={`max-w-[968px] mx-auto px-6`}>
      <div
        data-tina-field={tinaField(
          data,
          lang === 'vi' ? 'content_vi' : 'content_en'
        )}
      >
        {renderRichTextBlock(content)}
      </div>
    </div>
  );
}
