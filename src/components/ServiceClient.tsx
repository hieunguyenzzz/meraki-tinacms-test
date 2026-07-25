'use client';

import { useEffect, useRef, useState } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';
import type { ServiceQuery } from '../../tina/__generated__/types';
import styles from './ServiceClient.module.css';
import MerakiImage from './ui/MerakiImage';

interface ServiceClientProps {
  data: ServiceQuery;
  query: string;
  variables: { relativePath: string };
  lang: string;
}

type Journal = NonNullable<
  NonNullable<ServiceQuery['service']['featured_journals']>['first']
>;

const localized = (
  english?: string | null,
  vietnamese?: string | null,
  lang = 'en'
) =>
  lang === 'vi' ? vietnamese || english || '' : english || vietnamese || '';

export default function ServiceClient({
  data,
  query,
  variables,
  lang,
}: ServiceClientProps) {
  const { data: tinaData } = useTina({ data, query, variables });
  const service = tinaData.service;
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(() => new Set([0]));
  const [activeWeddingPanel, setActiveWeddingPanel] = useState<
    'destination' | 'city' | null
  >(null);
  const [leavingWeddingPanel, setLeavingWeddingPanel] = useState<
    'destination' | 'city' | null
  >(null);
  const weddingPanelExitTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const hero = service.hero;
  const introduction = service.introduction;
  const weddingTypes = service.wedding_types;
  const scope = service.scope;
  const faqs = service.faqs?.filter(Boolean) || [];
  const journals = [
    service.featured_journals?.first,
    service.featured_journals?.second,
    service.featured_journals?.third,
  ].filter((journal): journal is Journal => Boolean(journal?.published));

  const toggleFaq = (index: number) => {
    setOpenFaqs((current) => {
      const next = new Set(current);

      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }

      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (weddingPanelExitTimer.current) {
        clearTimeout(weddingPanelExitTimer.current);
      }
    };
  }, []);

  const activateWeddingPanel = (panel: 'destination' | 'city') => {
    setLeavingWeddingPanel((current) => {
      if (current !== panel) {
        return current;
      }

      if (weddingPanelExitTimer.current) {
        clearTimeout(weddingPanelExitTimer.current);
        weddingPanelExitTimer.current = null;
      }

      return null;
    });
    setActiveWeddingPanel(panel);
  };

  const deactivateWeddingPanel = (panel: 'destination' | 'city') => {
    setActiveWeddingPanel((current) => (current === panel ? null : current));
    setLeavingWeddingPanel(panel);

    if (weddingPanelExitTimer.current) {
      clearTimeout(weddingPanelExitTimer.current);
    }

    weddingPanelExitTimer.current = setTimeout(() => {
      setLeavingWeddingPanel((current) => (current === panel ? null : current));
      weddingPanelExitTimer.current = null;
    }, 700);
  };

  return (
    <div className="bg-background-base">
      <main>
        {hero && (
          <section className="relative">
            <div className="grid lg:grid-cols-2 lg:min-h-[720px]">
              <div
                className="relative min-h-[460px] overflow-hidden lg:min-h-0"
                data-tina-field={tinaField(hero, 'background_image')}
              >
                {hero.background_image ? (
                  <MerakiImage
                    src={hero.background_image}
                    alt={localized(hero.title_en, hero.title_vi, lang)}
                    fill
                    priority
                    sizes="(min-width: 1280px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full bg-background-2" />
                )}
              </div>

              <div className="bg-background-1 bg-paper relative flex flex-col items-center justify-center gap-10 px-6 py-16 text-center md:px-16 lg:gap-16 lg:px-20">
                <h1
                  className="text-display font-vocago uppercase tracking-wide"
                  data-tina-field={tinaField(
                    hero,
                    lang === 'vi' ? 'title_vi' : 'title_en'
                  )}
                >
                  {localized(hero.title_en, hero.title_vi, lang)}
                </h1>

                {hero.featured_image && (
                  <div
                    className="relative w-[156px] overflow-hidden sm:w-[184px]"
                    data-tina-field={tinaField(hero, 'featured_image')}
                  >
                    <MerakiImage
                      src={hero.featured_image}
                      alt="Meraki wedding detail"
                      width={184}
                      height={252}
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}

                <p
                  className="max-w-sm text-body-md text-text-secondary"
                  data-tina-field={tinaField(
                    hero,
                    lang === 'vi' ? 'description_vi' : 'description_en'
                  )}
                >
                  {localized(hero.description_en, hero.description_vi, lang)}
                </p>
              </div>
            </div>
          </section>
        )}

        {introduction && (
          <section className="px-6 py-16 text-center md:px-12 lg:py-20">
            <p
              className="mx-auto max-w-3xl text-body-md text-text-secondary"
              data-tina-field={tinaField(
                introduction,
                lang === 'vi' ? 'text_vi' : 'text_en'
              )}
            >
              {localized(introduction.text_en, introduction.text_vi, lang)}
            </p>
          </section>
        )}

        {weddingTypes && (
          <section className="px-4 pb-16 md:px-12 lg:pb-28">
            <div
              className={`mx-auto max-w-[1408px] ${styles.weddingTypesGrid} ${
                activeWeddingPanel === 'destination'
                  ? styles.destinationActive
                  : activeWeddingPanel === 'city'
                  ? styles.cityActive
                  : ''
              } ${
                leavingWeddingPanel === 'destination'
                  ? styles.destinationLeaving
                  : leavingWeddingPanel === 'city'
                  ? styles.cityLeaving
                  : ''
              }`}
            >
              {weddingTypes.destination && (
                <WeddingPanel
                  className={`${styles.typePanel} ${styles.destinationPanel}`}
                  panel={weddingTypes.destination}
                  panelName="destination"
                  lang={lang}
                  onActivate={activateWeddingPanel}
                  onDeactivate={deactivateWeddingPanel}
                />
              )}

              {weddingTypes.city && (
                <WeddingPanel
                  className={`${styles.typePanel} ${styles.cityPanel}`}
                  panel={weddingTypes.city}
                  panelName="city"
                  lang={lang}
                  onActivate={activateWeddingPanel}
                  onDeactivate={deactivateWeddingPanel}
                />
              )}
            </div>
          </section>
        )}

        {scope && (
          <section className="px-6 pb-20 text-center md:px-12 lg:pb-28">
            <div className="mx-auto max-w-5xl">
              <h2
                className="text-h3 font-vocago"
                data-tina-field={tinaField(
                  scope,
                  lang === 'vi' ? 'title_vi' : 'title_en'
                )}
              >
                {localized(scope.title_en, scope.title_vi, lang)}
              </h2>
              <p
                className="mx-auto mt-3 max-w-2xl text-body-md text-text-secondary"
                data-tina-field={tinaField(
                  scope,
                  lang === 'vi' ? 'description_vi' : 'description_en'
                )}
              >
                {localized(scope.description_en, scope.description_vi, lang)}
              </p>
              <div className="mt-8 flex flex-wrap justify-center">
                {scope.items?.filter(Boolean).map((item, index) => (
                  <span
                    key={`${item?.label_en}-${index}`}
                    className="border-r border-line-secondary px-3 py-1 text-body-sm text-text-secondary last:border-r-0"
                    data-tina-field={tinaField(
                      item,
                      lang === 'vi' ? 'label_vi' : 'label_en'
                    )}
                  >
                    {localized(item?.label_en, item?.label_vi, lang)}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {journals.length > 0 && (
          <section className="px-0 py-10 md:px-12 lg:py-16">
            <div className="mx-auto max-w-6xl bg-background-base px-6 py-12 md:px-12 lg:px-16">
              <div className="grid gap-10 md:grid-cols-3 md:gap-5 lg:gap-8">
                {journals.map((journal) => (
                  <a
                    key={journal.id}
                    href={`/${lang}/journal/${journal.slug}`}
                    className="group block text-center"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <MerakiImage
                        src={journal.featured_image}
                        alt={journal.couple_names}
                        fill
                        sizes="(min-width: 744px) 30vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h2 className="mt-5 text-h4 font-vocago uppercase text-text-accent">
                      {localized(
                        journal.template_layout?.main_headline_en,
                        journal.template_layout?.main_headline_vi,
                        lang
                      ) || journal.couple_names}
                    </h2>
                    <p className="mt-1 text-body-sm text-text-secondary">
                      {journal.couple_names}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="bg-background-support1 px-6 py-16 md:px-12 lg:py-20">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-center text-h3 font-vocago">FAQs</h2>
              <div className="border-t border-line-primary">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqs.has(index);
                  const answerId = `service-faq-answer-${index}`;

                  return (
                    <div
                      key={faq?.question_en || index}
                      className="border-b border-line-primary"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-6 py-5 text-left text-body-md text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-line-accent focus-visible:ring-inset"
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        onClick={() => toggleFaq(index)}
                        data-tina-field={tinaField(
                          faq,
                          lang === 'vi' ? 'question_vi' : 'question_en'
                        )}
                      >
                        <span>
                          {localized(faq?.question_en, faq?.question_vi, lang)}
                        </span>
                        <span className="text-h4" aria-hidden="true">
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {isOpen && (
                        <p
                          id={answerId}
                          className="pb-5 text-body-sm text-text-secondary"
                          data-tina-field={tinaField(
                            faq,
                            lang === 'vi' ? 'answer_vi' : 'answer_en'
                          )}
                        >
                          {localized(faq?.answer_en, faq?.answer_vi, lang)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {service.lets_connect && (
          <section className="bg-background-1 bg-paper px-6 py-16 text-center md:px-12 lg:py-20">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <MerakiImage
                src="/images/botanical/2.svg"
                alt=""
                width={48}
                className="h-auto w-12"
              />
              <h2
                className="mt-6 text-h3 font-vocago"
                data-tina-field={tinaField(
                  service.lets_connect,
                  lang === 'vi' ? 'title_vi' : 'title_en'
                )}
              >
                {localized(
                  service.lets_connect.title_en,
                  service.lets_connect.title_vi,
                  lang
                )}
              </h2>
              <p
                className="mt-3 text-body-md text-text-secondary"
                data-tina-field={tinaField(
                  service.lets_connect,
                  lang === 'vi' ? 'description_vi' : 'description_en'
                )}
              >
                {localized(
                  service.lets_connect.description_en,
                  service.lets_connect.description_vi,
                  lang
                )}
              </p>
              <a
                href={`/${lang}/lets-connect`}
                className="mt-6 border-b border-text-primary pb-1 text-body-md text-text-primary transition-colors hover:border-text-accent hover:text-text-accent"
                data-tina-field={tinaField(
                  service.lets_connect,
                  lang === 'vi' ? 'button_text_vi' : 'button_text_en'
                )}
              >
                {localized(
                  service.lets_connect.button_text_en,
                  service.lets_connect.button_text_vi,
                  lang
                )}
              </a>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}

type WeddingPanelProps = {
  className: string;
  panel: {
    background_image?: string | null;
    title_en: string;
    title_vi: string;
    description_en: string;
    description_vi: string;
  };
  panelName: 'destination' | 'city';
  lang: string;
  onActivate: (panel: 'destination' | 'city') => void;
  onDeactivate: (panel: 'destination' | 'city') => void;
};

function WeddingPanel({
  className,
  panel,
  panelName,
  lang,
  onActivate,
  onDeactivate,
}: WeddingPanelProps) {
  return (
    <div
      className={className}
      onMouseEnter={() => onActivate(panelName)}
      onMouseLeave={() => onDeactivate(panelName)}
      onFocus={() => onActivate(panelName)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onDeactivate(panelName);
        }
      }}
    >
      <div
        className={styles.panelMedia}
        data-tina-field={tinaField(panel, 'background_image')}
      >
        {panel.background_image ? (
          <MerakiImage
            src={panel.background_image}
            alt={localized(panel.title_en, panel.title_vi, lang)}
            fill
            sizes="(min-width: 744px) 50vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full bg-background-2" />
        )}
      </div>
      <div className={`${styles.panelSurface} bg-paper`}>
        <h2
          className="text-h3 font-vocago"
          data-tina-field={tinaField(
            panel,
            lang === 'vi' ? 'title_vi' : 'title_en'
          )}
        >
          {localized(panel.title_en, panel.title_vi, lang)}
        </h2>
        <p
          className="mt-8 whitespace-pre-line text-body-sm text-text-secondary"
          data-tina-field={tinaField(
            panel,
            lang === 'vi' ? 'description_vi' : 'description_en'
          )}
        >
          {localized(panel.description_en, panel.description_vi, lang)}
        </p>
        <a
          href={`/${lang}/lets-connect`}
          className="mt-8 inline-block border-b border-text-primary pb-1 text-body-sm text-text-primary transition-colors hover:border-text-accent hover:text-text-accent"
          aria-label={`${localized(
            panel.title_en,
            panel.title_vi,
            lang
          )} contact us`}
          data-service-panel={panelName}
        >
          {lang === 'vi' ? 'Liên hệ' : 'Contact Us'}
        </a>
      </div>
    </div>
  );
}
