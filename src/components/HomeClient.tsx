'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import type { ReactElement } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown, type TinaMarkdownContent } from 'tinacms/dist/rich-text';
import Footer from './Footer';
import HomeServicePanels from './HomeServicePanels';
import MerakiImage from './ui/MerakiImage';

interface HomeClientProps {
  data: any;
  variables: any;
  query: string;
  lang: string;
}

const t = (text: { en?: string | null; vi?: string | null }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const localizedRichText = (
  english?: TinaMarkdownContent | TinaMarkdownContent[] | null,
  vietnamese?: TinaMarkdownContent | TinaMarkdownContent[] | null,
  lang = 'en'
) => (lang === 'en' ? english : vietnamese);

type RichTextComponentProps = { children: ReactElement } | undefined;

const splitCoupleNames = (names?: string | null): [string, string] => {
  if (!names) return ['', ''];

  const [left, ...rightParts] = names.split(',');
  return [left.trim(), rightParts.join(',').trim()];
};

const buttonLabel = {
  explore: { en: 'Explore More', vi: 'Khám phá thêm' },
  read: { en: 'Read All', vi: 'Đọc tất cả' },
  team: { en: 'Meet Meraki Team', vi: 'Gặp gỡ team Meraki' },
  contact: { en: 'Contact Us', vi: 'Liên hệ với chúng tôi' },
};

function EditorialLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-block border-b border-line-primary px-4 pb-1 text-body-sm text-text-primary transition-all hover:-translate-y-0.5 hover:border-text-accent hover:text-text-accent"
    >
      {children}
    </Link>
  );
}

function AccentRichText({
  content,
}: {
  content?: TinaMarkdownContent | TinaMarkdownContent[] | null;
}) {
  if (!content) return null;

  return (
    <TinaMarkdown
      content={content}
      components={{
        p: (props: RichTextComponentProps) => (
          <p className="whitespace-pre-line">{props?.children}</p>
        ),
        italic: (props: RichTextComponentProps) => (
          <em className="text-handwriting text-[1.5em] text-text-accent not-italic">
            {props?.children}
          </em>
        ),
      }}
    />
  );
}

export default function HomeClient({
  data,
  variables,
  query,
  lang,
}: HomeClientProps) {
  const { data: tinaData } = useTina({ data, variables, query });
  const page = tinaData?.page;
  const hero = page?.hero;
  const introduction = page?.introduction;
  const journals = [
    page?.featured_journals?.first,
    page?.featured_journals?.second,
    page?.featured_journals?.third,
    page?.featured_journals?.fourth,
    page?.featured_journals?.fifth,
    page?.featured_journals?.sixth,
  ].filter((journal) => Boolean(journal?.published));
  const services = page?.services_section;
  const loveNotes = page?.love_notes_section;
  const team = page?.team_section;
  const connect = page?.connect_section;
  const instagram = page?.instagram_section;
  const heroImages = hero?.gallery || [];

  const heroTitle =
    t({ en: hero?.title_en, vi: hero?.title_vi }, lang) ||
    t({ en: page?.title_en, vi: page?.title_vi }, lang);
  const heroSubtitle = t(
    { en: hero?.subtitle_en, vi: hero?.subtitle_vi },
    lang
  );
  const introductionText = localizedRichText(
    introduction?.text_en,
    introduction?.text_vi,
    lang
  );
  const teamText = localizedRichText(team?.text_en, team?.text_vi, lang);
  const loveNoteCoupleNames = t(
    {
      en: loveNotes?.couple_names_en,
      vi: loveNotes?.couple_names_vi,
    },
    lang
  );
  const loveNoteLocation = t(
    {
      en: loveNotes?.wedding_location_en,
      vi: loveNotes?.wedding_location_vi,
    },
    lang
  );
  const loveNoteExcerpt = t(
    { en: loveNotes?.excerpt_en, vi: loveNotes?.excerpt_vi },
    lang
  );
  const loveNoteBody = t(
    { en: loveNotes?.note_en, vi: loveNotes?.note_vi },
    lang
  );
  const [loveNoteLeftName, loveNoteRightName] =
    splitCoupleNames(loveNoteCoupleNames);

  const journalRows: any[][] = [];
  for (let index = 0; index < journals.length; index += 2) {
    journalRows.push(journals.slice(index, index + 2));
  }

  return (
    <div className="overflow-hidden bg-background-base text-text-primary">
      <main>
        <section className="flex min-h-[220px] items-center justify-center px-6 py-16 text-center md:min-h-[300px] md:py-20">
          <div>
            <h1
              className="font-vocago text-h1 uppercase tracking-[0.04em] text-text-accent md:text-display"
              data-tina-field={
                hero
                  ? tinaField(hero, lang === 'en' ? 'title_en' : 'title_vi')
                  : undefined
              }
            >
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p
                className="mt-4 text-body-sm uppercase tracking-[0.18em] text-text-secondary"
                data-tina-field={
                  hero
                    ? tinaField(
                        hero,
                        lang === 'en' ? 'subtitle_en' : 'subtitle_vi'
                      )
                    : undefined
                }
              >
                {heroSubtitle}
              </p>
            )}
          </div>
        </section>

        <section
          className="grid h-[320px] grid-cols-2 md:h-[520px] md:grid-cols-4 xl:h-[650px]"
          data-tina-field={hero ? tinaField(hero, 'gallery') : undefined}
        >
          {heroImages.map((image: string, index: number) => (
            <div key={`${image}-${index}`} className="relative overflow-hidden">
              <MerakiImage
                src={image}
                alt={`${heroTitle || 'Meraki wedding'} ${index + 1}`}
                fill
                sizes="(min-width: 744px) 25vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </section>

        <section className="px-6 py-24 text-center md:py-36">
          <div className="mx-auto max-w-[620px]">
            <div
              className="whitespace-pre-line text-body-lg leading-relaxed text-text-secondary"
              data-tina-field={
                introduction
                  ? tinaField(
                      introduction,
                      lang === 'en' ? 'text_en' : 'text_vi'
                    )
                  : undefined
              }
            >
              <AccentRichText content={introductionText} />
            </div>
            <div className="mt-7">
              <EditorialLink href={`/${lang}/journal`}>
                {t(buttonLabel.explore, lang)}
              </EditorialLink>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 md:px-10 md:pb-36">
          <div className="mx-auto max-w-[1380px] space-y-14 md:space-y-20">
            {journalRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex flex-col gap-10 md:flex-row md:gap-5 ${
                  rowIndex % 2 === 1 ? 'md:justify-end' : 'md:justify-start'
                }`}
              >
                {row.map((journal: any, journalIndex: number) => {
                  const title =
                    t(
                      {
                        en: journal?.template_layout?.main_headline_en,
                        vi: journal?.template_layout?.main_headline_vi,
                      },
                      lang
                    ) ||
                    journal?.template_layout?.main_headline_en ||
                    journal?.template_layout?.main_headline_vi ||
                    journal?.couple_names;

                  return (
                    <article
                      key={journal?.id || `${journal?.slug}-${journalIndex}`}
                      className="group w-full md:w-[32%]"
                      data-tina-field={tinaField(journal, 'featured_image')}
                    >
                      <Link href={`/${lang}/journal/${journal?.slug}`}>
                        <div className="relative aspect-[2/3] overflow-hidden bg-background-1">
                          <MerakiImage
                            src={journal?.featured_image}
                            alt={`${title} — ${journal?.couple_names}`}
                            fill
                            sizes="(min-width: 744px) 32vw, 100vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          />
                        </div>
                        <div className="px-3 pt-5 text-center">
                          <h2
                            className="font-vocago text-h4 uppercase leading-tight tracking-[0.04em] text-text-accent"
                            data-tina-field={
                              journal?.template_layout
                                ? tinaField(
                                    journal.template_layout,
                                    lang === 'en'
                                      ? 'main_headline_en'
                                      : 'main_headline_vi'
                                  )
                                : undefined
                            }
                          >
                            {title}
                          </h2>
                          <p
                            className="mt-2 text-body-sm text-text-secondary"
                            data-tina-field={tinaField(journal, 'couple_names')}
                          >
                            {journal?.couple_names}
                          </p>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-background-1 bg-paper px-6 py-16 text-center md:py-20">
          <h2
            className="font-vocago text-h2 text-text-primary md:text-h3"
            data-tina-field={
              services
                ? tinaField(services, lang === 'en' ? 'title_en' : 'title_vi')
                : undefined
            }
          >
            {t({ en: services?.title_en, vi: services?.title_vi }, lang)}
          </h2>
          <p
            className="mx-auto mt-3 max-w-[600px] text-body-sm text-text-secondary"
            data-tina-field={
              services
                ? tinaField(
                    services,
                    lang === 'en' ? 'description_en' : 'description_vi'
                  )
                : undefined
            }
          >
            {t(
              {
                en: services?.description_en,
                vi: services?.description_vi,
              },
              lang
            )}
          </p>
          <div className="mt-7">
            <EditorialLink href={`/${lang}/service`}>
              {t(buttonLabel.explore, lang)}
            </EditorialLink>
          </div>
        </section>

        <HomeServicePanels services={services} lang={lang} />

        <section className="bg-background-support1 px-6 py-20 md:px-12 md:py-28 lg:px-20">
          <div className="mx-auto grid max-w-[1480px] items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="text-center">
              <h2
                className="font-vocago text-h3 md:text-h3"
                data-tina-field={
                  loveNotes
                    ? tinaField(
                        loveNotes,
                        lang === 'en' ? 'title_en' : 'title_vi'
                      )
                    : undefined
                }
              >
                {t({ en: loveNotes?.title_en, vi: loveNotes?.title_vi }, lang)}
              </h2>
              <p
                className="mx-auto mt-5 max-w-[470px] text-body-md leading-relaxed text-text-secondary"
                data-tina-field={
                  loveNotes
                    ? tinaField(
                        loveNotes,
                        lang === 'en' ? 'description_en' : 'description_vi'
                      )
                    : undefined
                }
              >
                {t(
                  {
                    en: loveNotes?.description_en,
                    vi: loveNotes?.description_vi,
                  },
                  lang
                )}
              </p>
              <div className="mt-7">
                <EditorialLink href={`/${lang}/love-notes`}>
                  {t(buttonLabel.read, lang)}
                </EditorialLink>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[720px] pb-72 md:pb-80">
              <div
                className="relative aspect-[5/4] overflow-hidden"
                data-tina-field={
                  loveNotes ? tinaField(loveNotes, 'image') : undefined
                }
              >
                <MerakiImage
                  src={loveNotes?.image}
                  alt={loveNoteCoupleNames || 'Meraki couple'}
                  fill
                  sizes="(min-width: 1280px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-paper absolute bottom-0 left-1/2 w-[70%] max-w-[442px] -translate-x-1/2 bg-background-1 px-6 py-8 text-center shadow-sm md:p-6">
                <h3
                  className="font-vocago uppercase tracking-[0.04em] md:text-h3"
                  data-tina-field={
                    loveNotes
                      ? tinaField(
                          loveNotes,
                          lang === 'en' ? 'couple_names_en' : 'couple_names_vi'
                        )
                      : undefined
                  }
                >
                  <span>{loveNoteLeftName}</span>
                  {loveNoteRightName && (
                    <>
                      <span className="px-2 text-body-lg font-normal lowercase">
                        &
                      </span>
                      <span>{loveNoteRightName}</span>
                    </>
                  )}
                </h3>

                <img
                  src="/images/botanical/2.svg"
                  alt=""
                  width={24}
                  height={24}
                  loading="lazy"
                  className="mx-auto mt-3 h-6 w-auto opacity-75"
                />

                {loveNoteExcerpt && (
                  <p
                    className="mt-5 text-handwriting text-[28px] leading-relaxed text-text-primary md:text-[24px]"
                    data-tina-field={
                      loveNotes
                        ? tinaField(
                            loveNotes,
                            lang === 'en' ? 'excerpt_en' : 'excerpt_vi'
                          )
                        : undefined
                    }
                  >
                    {loveNoteExcerpt}
                  </p>
                )}

                {loveNoteBody && (
                  <p
                    className="mt-6 overflow-hidden text-body-md leading-relaxed text-text-secondary"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 8,
                      WebkitBoxOrient: 'vertical',
                    }}
                    data-tina-field={
                      loveNotes
                        ? tinaField(
                            loveNotes,
                            lang === 'en' ? 'note_en' : 'note_vi'
                          )
                        : undefined
                    }
                  >
                    {loveNoteBody}
                  </p>
                )}
                {loveNoteLocation && (
                  <p
                    className="mt-5 text-body-sm font-medium uppercase tracking-[0.16em] text-text-secondary"
                    data-tina-field={
                      loveNotes
                        ? tinaField(
                            loveNotes,
                            lang === 'en'
                              ? 'wedding_location_en'
                              : 'wedding_location_vi'
                          )
                        : undefined
                    }
                  >
                    {lang === 'en' ? 'Wedding in ' : ''}
                    {loveNoteLocation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 text-center md:py-32">
          <div
            className="mx-auto max-w-[620px] whitespace-pre-line text-h4 leading-relaxed text-text-secondary md:text-h2"
            data-tina-field={
              team
                ? tinaField(team, lang === 'en' ? 'text_en' : 'text_vi')
                : undefined
            }
          >
            <AccentRichText content={teamText} />
          </div>
          <div className="mt-8">
            <EditorialLink href={`/${lang}/about`}>
              {t(buttonLabel.team, lang)}
            </EditorialLink>
          </div>
          <div
            className="relative mx-auto mt-16 aspect-[3/2] max-w-[680px] overflow-hidden"
            data-tina-field={team ? tinaField(team, 'image') : undefined}
          >
            <MerakiImage
              src={team?.image}
              alt="Meraki wedding planning team"
              fill
              sizes="(min-width: 744px) 680px, 90vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="bg-paper bg-background-1 px-6 py-20 text-center md:py-24">
          <div className="relative mx-auto max-w-[580px]">
            <img
              src="/images/botanical/3.svg"
              alt=""
              width={28}
              height={28}
              loading="lazy"
              className="mx-auto mb-5 h-7 w-7 opacity-70"
            />
            <h2
              className="font-vocago text-h2 md:text-h3"
              data-tina-field={
                connect
                  ? tinaField(connect, lang === 'en' ? 'title_en' : 'title_vi')
                  : undefined
              }
            >
              {t({ en: connect?.title_en, vi: connect?.title_vi }, lang)}
            </h2>
            <p
              className="mt-4 text-body-sm leading-relaxed text-text-secondary"
              data-tina-field={
                connect
                  ? tinaField(
                      connect,
                      lang === 'en' ? 'description_en' : 'description_vi'
                    )
                  : undefined
              }
            >
              {t(
                {
                  en: connect?.description_en,
                  vi: connect?.description_vi,
                },
                lang
              )}
            </p>
            <div className="mt-7">
              <EditorialLink href={`/${lang}/lets-connect`}>
                {t(buttonLabel.contact, lang)}
              </EditorialLink>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 md:px-10 md:py-20">
          <h2
            className="text-center font-vocago text-h2 text-text-accent md:text-h3"
            data-tina-field={
              instagram ? tinaField(instagram, 'title') : undefined
            }
          >
            {instagram?.title || 'Instagram'}
          </h2>
          <div
            className="mx-auto mt-8 grid max-w-[1450px] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6"
            data-tina-field={
              instagram ? tinaField(instagram, 'images') : undefined
            }
          >
            {(instagram?.images || []).map((item: any, index: number) => {
              const image = item?.image;
              const imageContent = (
                <MerakiImage
                  src={image}
                  alt={`Meraki wedding inspiration ${index + 1}`}
                  fill
                  sizes="(min-width: 1280px) 16vw, (min-width: 744px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              );
              const className =
                'group relative aspect-square overflow-hidden bg-background-1';

              return item?.link ? (
                <a
                  key={`${image}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                  aria-label={`View Instagram feature ${index + 1}`}
                  data-tina-field={tinaField(item, 'image')}
                >
                  {imageContent}
                </a>
              ) : (
                <div
                  key={`${image}-${index}`}
                  className={className}
                  data-tina-field={tinaField(item, 'image')}
                >
                  {imageContent}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
