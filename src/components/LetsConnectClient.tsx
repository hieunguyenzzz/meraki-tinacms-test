'use client';

import { tinaField, useTina } from 'tinacms/dist/react';
import type { LetsConnectQuery } from '../../tina/__generated__/types';
import LetsConnectForm from '../app/[lang]/lets-connect/LetsConnectForm';
import Footer from './Footer';
import MerakiImage from './ui/MerakiImage';

interface Props {
  data: LetsConnectQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
}

const localized = (
  english?: string | null,
  vietnamese?: string | null,
  lang = 'en'
) => (lang === 'en' ? english : vietnamese) || '';

export default function LetsConnectClient({
  data,
  query,
  variables,
  lang,
}: Props) {
  const { data: tinaData } = useTina({ data, query, variables });
  const page = tinaData.letsConnect;
  const hero = page.hero;
  const introduction = page.introduction;
  const form = page.form;
  const faqSection = page.faq_section;
  const instagramSection = page.instagram_section;

  return (
    <div className="overflow-hidden bg-background-base text-text-primary">
      <main>
        {hero && (
          <section className="relative h-[460px] overflow-hidden md:h-[620px] lg:h-[760px]">
            <div
              className="absolute inset-0"
              data-tina-field={tinaField(hero, 'image')}
            >
              <MerakiImage
                src={hero.image}
                alt={localized(hero.image_alt_en, hero.image_alt_vi, lang)}
                fill
                priority
                sizes="100vw"
                thumborFitMode=""
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/5 to-black/10" />
            <h1
              className="absolute inset-x-6 top-16 text-center font-vocago text-h1 uppercase tracking-[0.04em] text-background-base md:top-24 md:text-display lg:top-28"
              data-tina-field={tinaField(
                hero,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {localized(hero.title_en, hero.title_vi, lang)}
            </h1>
          </section>
        )}

        <section className="px-5 pb-20 md:px-10 md:pb-28 lg:pb-36">
          <div className="mx-auto grid max-w-[1430px] gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(560px,680px)] lg:gap-20 xl:gap-28">
            {introduction && (
              <div className="pt-16 md:pt-20 lg:pt-24">
                <div className="max-w-[680px]">
                  <h2
                    className="font-vocago text-h3 text-text-accent"
                    data-tina-field={tinaField(
                      introduction,
                      lang === 'en' ? 'title_en' : 'title_vi'
                    )}
                  >
                    {localized(
                      introduction.title_en,
                      introduction.title_vi,
                      lang
                    )}
                  </h2>
                  <div className="mt-5 space-y-4 text-justify text-body-md leading-relaxed text-text-secondary">
                    {(introduction.paragraphs || []).map(
                      (paragraph, index) =>
                        paragraph && (
                          <p
                            key={index}
                            data-tina-field={tinaField(
                              paragraph,
                              lang === 'en' ? 'text_en' : 'text_vi'
                            )}
                          >
                            {localized(
                              paragraph.text_en,
                              paragraph.text_vi,
                              lang
                            )}
                          </p>
                        )
                    )}
                  </div>
                  <div className="mt-5 grid gap-5 text-body-sm uppercase text-text-secondary sm:grid-cols-2">
                    {(introduction.contacts || []).map(
                      (contact, index) =>
                        contact && (
                          <p key={index}>
                            <span
                              className="block"
                              data-tina-field={tinaField(
                                contact,
                                lang === 'en' ? 'label_en' : 'label_vi'
                              )}
                            >
                              {localized(
                                contact.label_en,
                                contact.label_vi,
                                lang
                              )}
                            </span>
                            <a
                              href={contact.link}
                              className="normal-case transition-colors hover:text-text-accent"
                              data-tina-field={tinaField(contact, 'value')}
                            >
                              {contact.value}
                            </a>
                          </p>
                        )
                    )}
                  </div>
                </div>
              </div>
            )}

            {form && <LetsConnectForm lang={lang} content={form} />}
          </div>
        </section>

        {faqSection && (
          <section className="bg-background-support1 px-5 py-20 md:px-10 md:py-24">
            <div className="mx-auto max-w-[720px]">
              <h2
                className="text-center font-vocago text-h1 text-text-primary"
                data-tina-field={tinaField(
                  faqSection,
                  lang === 'en' ? 'title_en' : 'title_vi'
                )}
              >
                {localized(faqSection.title_en, faqSection.title_vi, lang)}
              </h2>
              <div className="mt-8 divide-y divide-line-primary border-b border-line-primary">
                {(faqSection.items || []).map(
                  (faq, index) =>
                    faq && (
                      <details
                        key={index}
                        className="group py-5"
                        open={index === 0}
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-body-md text-text-primary marker:content-none">
                          <span
                            data-tina-field={tinaField(
                              faq,
                              lang === 'en' ? 'question_en' : 'question_vi'
                            )}
                          >
                            {localized(faq.question_en, faq.question_vi, lang)}
                          </span>
                          <span
                            aria-hidden="true"
                            className="text-body-lg leading-none"
                          >
                            <span className="group-open:hidden">+</span>
                            <span className="hidden group-open:inline">−</span>
                          </span>
                        </summary>
                        <p
                          className="mt-3 pr-10 text-body-sm leading-relaxed text-text-secondary"
                          data-tina-field={tinaField(
                            faq,
                            lang === 'en' ? 'answer_en' : 'answer_vi'
                          )}
                        >
                          {localized(faq.answer_en, faq.answer_vi, lang)}
                        </p>
                      </details>
                    )
                )}
              </div>
            </div>
          </section>
        )}

        {instagramSection && (
          <section className="px-5 py-16 md:px-10 md:py-20">
            <h2
              className="text-center font-vocago text-h2 text-text-accent md:text-h3"
              data-tina-field={tinaField(
                instagramSection,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {localized(
                instagramSection.title_en,
                instagramSection.title_vi,
                lang
              )}
            </h2>
            <div className="mx-auto mt-8 grid max-w-[1450px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
              {(instagramSection.images || []).map(
                (item, index) =>
                  item && (
                    <a
                      key={index}
                      href={
                        item.link ||
                        'https://www.instagram.com/meraki.wedding.planner'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square overflow-hidden bg-background-1"
                      aria-label={localized(item.alt_en, item.alt_vi, lang)}
                      data-tina-field={tinaField(item, 'image')}
                    >
                      <MerakiImage
                        src={item.image}
                        alt={localized(item.alt_en, item.alt_vi, lang)}
                        fill
                        sizes="(min-width: 1280px) 16vw, (min-width: 744px) 33vw, 50vw"
                        thumborFitMode=""
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </a>
                  )
              )}
            </div>
          </section>
        )}
      </main>

      <Footer lang={lang} />
    </div>
  );
}
