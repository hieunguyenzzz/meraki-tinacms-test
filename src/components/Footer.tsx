'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import type { FooterQuery } from '../../tina/__generated__/types';

interface FooterProps {
  data: FooterQuery;
  lang: string;
  query: string;
  variables: { relativePath: string };
}

const localized = (
  english?: string | null,
  vietnamese?: string | null,
  lang = 'en'
) =>
  lang === 'vi' ? vietnamese || english || '' : english || vietnamese || '';

const resolveUrl = (url: string, lang: string) =>
  url.split('{lang}').join(lang);

function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'facebook') {
    return (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }

  return (
    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export default function Footer({ data, lang, query, variables }: FooterProps) {
  const { data: tinaData } = useTina({ data, query, variables });
  const footer = tinaData.footer;
  const currentYear = new Date().getFullYear().toString();
  const copyright = localized(footer.copyright_en, footer.copyright_vi, lang)
    .split('{year}')
    .join(currentYear);

  return (
    <footer className="bg-background-base py-16 text-text-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-12 lg:flex-row">
          <div className="md:pr-20">
            {footer.logo && (
              <img
                src={footer.logo}
                alt={footer.logo_alt}
                loading="lazy"
                className="mb-6 h-10 w-auto"
                data-tina-field={tinaField(footer, 'logo')}
              />
            )}
            <div className="space-y-2 text-body-sm text-text-secondary">
              {footer.contact_items?.map((item, index) => {
                if (!item) return null;

                const label = localized(item.label_en, item.label_vi, lang);
                const value = item.value;
                const hasVisibleValue = Boolean(value.trim());
                const content = (
                  <>
                    {label && (
                      <span
                        data-tina-field={tinaField(
                          item,
                          lang === 'vi' ? 'label_vi' : 'label_en'
                        )}
                      >
                        {label}
                        {hasVisibleValue && ' '}
                      </span>
                    )}
                    {hasVisibleValue && (
                      <span data-tina-field={tinaField(item, 'value')}>
                        {value}
                      </span>
                    )}
                  </>
                );

                return item.url ? (
                  <p key={`${label}-${value}-${index}`}>
                    <a
                      href={item.url}
                      className="underline-offset-4 decoration-1 transition-colors hover:text-text-secondary hover:underline"
                      data-tina-field={tinaField(item, 'url')}
                    >
                      {content}
                    </a>
                  </p>
                ) : (
                  <p key={`${label}-${value}-${index}`}>{content}</p>
                );
              })}
            </div>
            <div className="mt-6 flex gap-4">
              {footer.social_links?.map((social, index) => {
                if (!social) return null;

                return (
                  <a
                    key={`${social.platform}-${index}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary transition-colors hover:text-text-accent"
                    aria-label={social.label}
                    data-tina-field={tinaField(social, 'url')}
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-y-10 md:flex-row md:flex-wrap md:gap-x-20">
            {footer.navigation_sections?.map((section, sectionIndex) => {
              if (!section) return null;

              return (
                <div key={`${section.title_en}-${sectionIndex}`}>
                  <h4
                    className="mb-6 text-h3"
                    data-tina-field={tinaField(
                      section,
                      lang === 'vi' ? 'title_vi' : 'title_en'
                    )}
                  >
                    {localized(section.title_en, section.title_vi, lang)}
                  </h4>
                  <ul className="space-y-3 text-body-sm text-text-secondary">
                    {section.links?.map((link, linkIndex) => {
                      if (!link) return null;

                      return (
                        <li key={`${link.url}-${linkIndex}`}>
                          <a
                            href={resolveUrl(link.url, lang)}
                            className="underline-offset-4 decoration-1 transition-colors hover:text-text-secondary hover:underline"
                            data-tina-field={tinaField(link, 'url')}
                          >
                            <span
                              data-tina-field={tinaField(
                                link,
                                lang === 'vi' ? 'label_vi' : 'label_en'
                              )}
                            >
                              {localized(link.label_en, link.label_vi, lang)}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
        <div className="pt-8 text-center">
          <p
            className="text-body-sm text-text-secondary"
            data-tina-field={tinaField(
              footer,
              lang === 'vi' ? 'copyright_vi' : 'copyright_en'
            )}
          >
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
