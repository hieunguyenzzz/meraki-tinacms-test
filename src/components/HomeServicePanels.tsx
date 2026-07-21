'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { tinaField } from 'tinacms/dist/react';
import MerakiImage from './ui/MerakiImage';

interface HomeServicePanelsProps {
  services: any;
  lang: string;
}

const localized = (
  text: { en?: string | null; vi?: string | null },
  lang: string
) => (lang === 'en' ? text.en : text.vi);

export default function HomeServicePanels({
  services,
  lang,
}: HomeServicePanelsProps) {
  const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(
    null
  );

  return (
    <>
      <section className="grid grid-cols-1 md:hidden">
        {(services?.items || []).map((service: any, index: number) => (
          <div
            key={`${service?.title_en}-${index}`}
            className="group relative aspect-[4/3] overflow-hidden bg-background-brand"
            data-tina-field={tinaField(service, 'image')}
          >
            <MerakiImage
              src={service?.image}
              alt={
                localized(
                  { en: service?.title_en, vi: service?.title_vi },
                  lang
                ) || 'Meraki wedding service'
              }
              fill
              sizes="100vw"
              className="object-cover grayscale transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-background-brand/20 transition-colors group-hover:bg-background-brand/5" />
            <h3
              className="absolute inset-0 flex items-center justify-center px-8 text-center font-vocago text-h1 uppercase tracking-[0.04em] text-background-base drop-shadow-sm"
              data-tina-field={tinaField(
                service,
                lang === 'en' ? 'title_en' : 'title_vi'
              )}
            >
              {localized(
                { en: service?.title_en, vi: service?.title_vi },
                lang
              )}
            </h3>
          </div>
        ))}
      </section>

      <section
        className="hidden h-[clamp(520px,49.2vw,760px)] overflow-hidden md:flex"
        onMouseLeave={() => setActiveServiceIndex(null)}
        aria-label={
          localized({ en: services?.title_en, vi: services?.title_vi }, lang) ||
          'Wedding services'
        }
      >
        {(services?.items || []).map((service: any, index: number) => {
          const isActive = activeServiceIndex === index;
          const serviceTitle =
            localized({ en: service?.title_en, vi: service?.title_vi }, lang) ||
            'Meraki wedding service';

          return (
            <div
              key={`${service?.title_en}-${index}`}
              className="group relative min-w-0 overflow-hidden bg-background-brand transition-[flex-grow] duration-700 ease-in-out motion-reduce:transition-none"
              style={{ flexGrow: isActive ? 1.9 : 1 }}
              onMouseEnter={() => setActiveServiceIndex(index)}
            >
              <div
                className="absolute inset-0"
                data-tina-field={tinaField(service, 'image')}
              >
                <MerakiImage
                  src={service?.image}
                  alt={serviceTitle}
                  fill
                  sizes={isActive ? '66vw' : '34vw'}
                  className={`object-cover transition-[filter,transform] duration-700 ease-in-out motion-reduce:transition-none ${
                    isActive
                      ? 'scale-100 grayscale-0'
                      : 'scale-[1.015] grayscale'
                  }`}
                />
              </div>

              <div
                className={`absolute inset-0 bg-background-brand transition-opacity duration-700 ease-in-out motion-reduce:transition-none ${
                  isActive ? 'opacity-10' : 'opacity-40'
                }`}
              />

              <div
                className={`absolute inset-0 flex items-center justify-center px-7 text-center transition-[opacity,transform] duration-500 ease-in-out motion-reduce:transition-none ${
                  isActive
                    ? 'pointer-events-none translate-y-3 opacity-0'
                    : 'translate-y-0 opacity-100 delay-150'
                }`}
              >
                <h3
                  className="font-vocago text-[clamp(38px,4vw,64px)] uppercase leading-[1.08] tracking-[0.02em] text-background-base drop-shadow-sm"
                  data-tina-field={tinaField(
                    service,
                    lang === 'en' ? 'title_en' : 'title_vi'
                  )}
                >
                  {serviceTitle}
                </h3>
              </div>

              <article
                className={`bg-paper absolute left-1/2 top-1/2 flex w-[min(80%,478px)] -translate-x-1/2 flex-col items-center bg-background-base px-5 py-6 text-center shadow-sm transition-[opacity,transform] duration-700 ease-in-out motion-reduce:transition-none lg:h-[500px] lg:justify-between lg:px-5 lg:py-7 ${
                  isActive
                    ? '-translate-y-1/2 opacity-100 delay-150'
                    : 'pointer-events-none -translate-y-[46%] opacity-0'
                }`}
              >
                <h3
                  className="font-vocago text-[clamp(34px,3.6vw,52px)] uppercase leading-[1.08] tracking-[0.01em] text-text-primary"
                  data-tina-field={tinaField(
                    service,
                    lang === 'en' ? 'title_en' : 'title_vi'
                  )}
                >
                  {serviceTitle}
                </h3>

                <div className="relative mt-6 aspect-[4/5] w-[clamp(128px,11.7vw,168px)] overflow-hidden lg:mt-0">
                  <MerakiImage
                    src={service?.image}
                    alt=""
                    fill
                    sizes="168px"
                    className="object-cover"
                  />
                </div>

                <p
                  className="mt-6 max-w-[440px] text-body-sm leading-snug text-text-secondary lg:mt-0"
                  data-tina-field={tinaField(
                    service,
                    lang === 'en' ? 'description_en' : 'description_vi'
                  )}
                >
                  {localized(
                    {
                      en: service?.description_en,
                      vi: service?.description_vi,
                    },
                    lang
                  )}
                </p>
              </article>
            </div>
          );
        })}
      </section>
    </>
  );
}
