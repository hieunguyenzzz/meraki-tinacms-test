'use client';

import type { ReactElement } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import { TinaMarkdown, TinaMarkdownContent } from 'tinacms/dist/rich-text';
import type { AboutQuery } from '../../tina/__generated__/types';
import Footer from './Footer';
import Header from './Header';
import MerakiImage from './ui/MerakiImage';

interface Props {
  data: AboutQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
}

const localized = (
  english?: string | null,
  vietnamese?: string | null,
  lang = 'en'
) => (lang === 'en' ? english : vietnamese);

const localizedRichText = (
  english?: TinaMarkdownContent | TinaMarkdownContent[] | null,
  vietnamese?: TinaMarkdownContent | TinaMarkdownContent[] | null,
  lang = 'en'
) => (lang === 'en' ? english : vietnamese);

type RichTextComponentProps = { children: ReactElement } | undefined;

export default function AboutClient({ data, query, variables, lang }: Props) {
  const { data: tinaData } = useTina({ data, query, variables });
  const about = tinaData.about;
  const hero = about.hero;
  const statement = about.statement;
  const statementText = statement
    ? localizedRichText(statement.text_en, statement.text_vi, lang)
    : undefined;
  const mission = about.mission;
  const team = about.team_members || [];

  return (
    <div className="bg-background-base">
      <Header lang={lang} />

      <main>
        <section className="relative">
          <div className="grid lg:grid-cols-2 lg:min-h-[760px]">
            <div
              className="relative min-h-[480px] overflow-hidden lg:min-h-0"
              data-tina-field={tinaField(hero, 'background_image')}
            >
              {hero?.background_image && (
                <MerakiImage
                  src={hero.background_image}
                  alt={
                    localized(hero.title_en, hero.title_vi, lang) ||
                    'About Meraki'
                  }
                  fill
                  priority
                  sizes="(min-width: 1280px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              )}
            </div>

            <div className="bg-background-1 bg-paper relative flex flex-col items-center justify-center gap-8 px-6 py-16 text-center md:px-16 lg:gap-10 lg:px-20">
              <h1
                className="text-display font-vocago uppercase tracking-wide"
                data-tina-field={tinaField(
                  hero,
                  lang === 'en' ? 'title_en' : 'title_vi'
                )}
              >
                {localized(hero?.title_en, hero?.title_vi, lang)}
              </h1>

              {hero?.featured_image && (
                <div
                  className="relative z-10 w-48 overflow-hidden md:w-56"
                  data-tina-field={tinaField(hero, 'featured_image')}
                >
                  <MerakiImage
                    src={hero.featured_image}
                    alt="Meraki wedding planners"
                    width={224}
                    height={280}
                    className="h-auto w-full object-cover"
                  />
                </div>
              )}

              <div className="relative z-10 max-w-md space-y-1 text-text-secondary">
                <p
                  className="text-handwriting text-text-primary"
                  data-tina-field={tinaField(hero, 'brand_name')}
                >
                  {hero?.brand_name}
                </p>
                <p
                  className="text-body-sm"
                  data-tina-field={tinaField(hero, 'pronunciation')}
                >
                  {hero?.pronunciation}
                </p>
                <p
                  className="pt-2 text-body-md leading-relaxed"
                  data-tina-field={tinaField(
                    hero,
                    lang === 'en' ? 'description_en' : 'description_vi'
                  )}
                >
                  {localized(hero?.description_en, hero?.description_vi, lang)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background-1 px-6 py-20 text-center md:px-12 lg:py-28">
          <div
            className="mx-auto max-w-3xl text-body-lg leading-relaxed text-text-secondary md:text-h2"
            data-tina-field={tinaField(
              statement,
              lang === 'en' ? 'text_en' : 'text_vi'
            )}
          >
            {statementText && (
              <TinaMarkdown
                content={statementText}
                components={{
                  p: (props: RichTextComponentProps) => (
                    <p>{props?.children}</p>
                  ),
                  italic: (props: RichTextComponentProps) => (
                    <em className="text-handwriting text-[1.25em] not-italic">
                      {props?.children}
                    </em>
                  ),
                }}
              />
            )}
          </div>

          <div className="my-12 flex justify-center -rotate-90">
            <MerakiImage
              src="/images/botanical/6.svg"
              alt=""
              width={48}
              height={48}
              className="h-auto w-12"
            />
          </div>

          <div className="mx-auto max-w-2xl space-y-5 text-body-md leading-relaxed text-text-secondary text-justify">
            <p
              data-tina-field={tinaField(
                mission,
                lang === 'en' ? 'paragraph_one_en' : 'paragraph_one_vi'
              )}
            >
              {localized(
                mission?.paragraph_one_en,
                mission?.paragraph_one_vi,
                lang
              )}
            </p>
            <p
              data-tina-field={tinaField(
                mission,
                lang === 'en' ? 'paragraph_two_en' : 'paragraph_two_vi'
              )}
            >
              {localized(
                mission?.paragraph_two_en,
                mission?.paragraph_two_vi,
                lang
              )}
            </p>
          </div>
        </section>

        <section className="bg-background-1 px-6 pb-20 md:px-12 lg:pb-28">
          <h2
            className="mx-auto mb-14 max-w-md text-center text-h1 font-vocago leading-tight md:mb-20"
            data-tina-field={tinaField(
              about,
              lang === 'en' ? 'team_title_en' : 'team_title_vi'
            )}
          >
            {localized(about.team_title_en, about.team_title_vi, lang)}
          </h2>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-20">
            {team.map((member, index) => {
              const isRaised = index % 3 === 1;
              const name = localized(member?.name_en, member?.name_vi, lang);
              const role = localized(member?.role_en, member?.role_vi, lang);

              return (
                <article
                  key={`${member?.name_en || 'planner'}-${index}`}
                  className={`group mx-auto w-full max-w-[300px] ${isRaised ? 'lg:-translate-y-8' : ''
                    }`}
                >
                  <div
                    className="relative aspect-[3/4] overflow-hidden bg-background-2"
                    data-tina-field={tinaField(member, 'image')}
                  >
                    {member?.image && (
                      <MerakiImage
                        src={member.image}
                        alt={name || 'Meraki wedding planner'}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 744px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="border-b border-line-secondary px-2 py-3 text-center">
                    <p
                      className="text-body-md text-text-primary"
                      data-tina-field={tinaField(
                        member,
                        lang === 'en' ? 'name_en' : 'name_vi'
                      )}
                    >
                      {name}
                    </p>
                    <p
                      className="text-body-sm text-text-secondary"
                      data-tina-field={tinaField(
                        member,
                        lang === 'en' ? 'role_en' : 'role_vi'
                      )}
                    >
                      {role}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
