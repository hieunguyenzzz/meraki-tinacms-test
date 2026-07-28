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
        {(services?.items || []).map((service: any, index: number) => {
          const isActive = activeServiceIndex === index;
          const serviceTitle =
            localized({ en: service?.title_en, vi: service?.title_vi }, lang) ||
            'Meraki wedding service';
          const previewImage = service?.preview_image;
          const hoverImage = service?.hover_image || previewImage;

          return (
            <button
              key={`${service?.title_en}-${index}`}
              type="button"
              className="group relative aspect-[3/4] w-full overflow-hidden bg-background-brand text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-background-base"
              data-tina-field={tinaField(service, 'preview_image')}
              aria-expanded={isActive}
              aria-label={`${serviceTitle} ${
                isActive
                  ? lang === 'en'
                    ? 'close details'
                    : 'đóng nội dung'
                  : lang === 'en'
                  ? 'view details'
                  : 'xem nội dung'
              }`}
              onClick={() =>
                setActiveServiceIndex((current) =>
                  current === index ? null : index
                )
              }
            >
              <MerakiImage
                src={previewImage}
                alt={serviceTitle}
                fill
                sizes="100vw"
                className={`object-cover transition-[filter,transform] duration-700 ease-in-out motion-reduce:transition-none ${
                  isActive ? 'scale-100 grayscale-0' : 'scale-[1.015] grayscale'
                }`}
              />
              <div
                className={`absolute inset-0 bg-background-brand transition-opacity duration-700 motion-reduce:transition-none ${
                  isActive ? 'opacity-10' : 'opacity-35'
                }`}
              />
              <h3
                className={`absolute inset-0 flex items-center justify-center px-8 text-center font-vocago text-h1 uppercase tracking-[0.04em] text-background-base drop-shadow-sm transition-[opacity,transform] duration-500 motion-reduce:transition-none ${
                  isActive
                    ? 'pointer-events-none translate-y-3 opacity-0'
                    : 'translate-y-0 opacity-100'
                }`}
                data-tina-field={tinaField(
                  service,
                  lang === 'en' ? 'title_en' : 'title_vi'
                )}
              >
                {serviceTitle}
              </h3>

              <article
                className={`bg-paper absolute left-1/2 top-1/2 flex max-h-[calc(100%-3rem)] w-[min(82%,320px)] -translate-x-1/2 flex-col items-center overflow-y-auto bg-background-base px-5 py-6 text-center shadow-sm transition-[opacity,transform] duration-700 ease-in-out motion-reduce:transition-none ${
                  isActive
                    ? '-translate-y-1/2 opacity-100 delay-150'
                    : 'pointer-events-none -translate-y-[46%] opacity-0'
                }`}
              >
                <h3
                  className="font-vocago text-h3 uppercase leading-[1.08] tracking-[0.01em] text-text-primary"
                  data-tina-field={tinaField(
                    service,
                    lang === 'en' ? 'title_en' : 'title_vi'
                  )}
                >
                  {serviceTitle}
                </h3>

                <div
                  className="relative mt-5 aspect-[4/5] w-[104px] shrink-0 overflow-hidden"
                  data-tina-field={tinaField(service, 'hover_image')}
                >
                  <MerakiImage
                    src={hoverImage}
                    alt=""
                    fill
                    sizes="104px"
                    className="object-cover"
                  />
                </div>

                <p
                  className="mt-5 text-body-sm leading-snug text-text-secondary"
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
            </button>
          );
        })}
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
          const previewImage = service?.preview_image;
          const hoverImage = service?.hover_image || previewImage;

          return (
            <div
              key={`${service?.title_en}-${index}`}
              className="group relative min-w-0 overflow-hidden bg-background-brand transition-[flex-grow] duration-700 ease-in-out motion-reduce:transition-none"
              style={{ flexGrow: isActive ? 1.9 : 1 }}
              onMouseEnter={() => setActiveServiceIndex(index)}
            >
              <div
                className="absolute inset-0"
                data-tina-field={tinaField(service, 'preview_image')}
              >
                <MerakiImage
                  src={previewImage}
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

                <div
                  className="relative mt-6 aspect-[4/5] w-[clamp(128px,11.7vw,168px)] overflow-hidden lg:mt-0"
                  data-tina-field={tinaField(service, 'hover_image')}
                >
                  <MerakiImage
                    src={hoverImage}
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
