'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTina, tinaField } from 'tinacms/dist/react';
import Header from './Header';
import Footer from './Footer';

interface HomeClientProps {
  data: any;
  variables: any;
  query: string;
  lang: string;
}

// Helper function to get localized text
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

// Default content
const defaultContent = {
  title: 'Meraki Wedding Planner',
  description: {
    en: 'Professional wedding planning services in Vietnam',
    vi: 'Dịch vụ tổ chức tiệc cưới chuyên nghiệp tại Việt Nam',
  },
  hero: {
    subtitle: {
      en: 'Creating unforgettable moments with love and passion',
      vi: 'Tạo nên những khoảnh khắc khó quên với tình yêu và đam mê',
    },
  },
};

// Hero Section Component
function HeroSection({ lang, page }: { lang: string; page: any }) {
  const title = page?.hero 
    ? t({ en: page.hero.title_en || '', vi: page.hero.title_vi || '' }, lang) || defaultContent.title
    : defaultContent.title;
    
  const subtitle = page?.hero
    ? t({ en: page.hero.subtitle_en || '', vi: page.hero.subtitle_vi || '' }, lang) || t(defaultContent.hero.subtitle, lang)
    : t(defaultContent.hero.subtitle, lang);

  return (
    <section className='relative h-screen flex items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <h1 
          className='text-5xl md:text-6xl font-light text-gray-900 mb-6'
          data-tina-field={page?.hero ? tinaField(page.hero, lang === 'en' ? 'title_en' : 'title_vi') : undefined}>
          {title}
        </h1>
        <p 
          className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'
          data-tina-field={page?.hero ? tinaField(page.hero, lang === 'en' ? 'subtitle_en' : 'subtitle_vi') : undefined}>
          {subtitle}
        </p>
        <div className='space-x-4'>
          <a
            href={`/${lang}/journal`}
            className='inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors'>
            {t({ en: 'View Our Work', vi: 'Xem tác phẩm' }, lang)}
          </a>
          <a
            href={`/${lang}/about`}
            className='inline-block border border-gray-900 text-gray-900 px-8 py-3 rounded-md hover:bg-gray-900 hover:text-white transition-colors'>
            {t({ en: 'About Us', vi: 'Về chúng tôi' }, lang)}
          </a>
        </div>
      </div>
    </section>
  );
}

// Services Section Component
function ServicesSection({ lang, page }: { lang: string; page: any }) {
  // Check if services are defined in the CMS, otherwise use default
  const services = page?.services || [
    { en: 'Full Planning', vi: 'Tổ chức trọn gói', desc: { en: 'Complete wedding planning from start to finish', vi: 'Tổ chức tiệc cưới hoàn chỉnh từ đầu đến cuối' }},
    { en: 'Partial Planning', vi: 'Tổ chức một phần', desc: { en: 'Assistance with specific aspects of your wedding', vi: 'Hỗ trợ các khía cạnh cụ thể của đám cưới' }},
    { en: 'Day Coordination', vi: 'Điều phối ngày cưới', desc: { en: 'Ensuring everything runs smoothly on your wedding day', vi: 'Đảm bảo mọi thứ diễn ra suôn sẻ trong ngày cưới' }},
  ];

  return (
    <section className='py-16 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h2 
            className='text-3xl font-light text-gray-900 mb-4'
            data-tina-field={page?.services_section ? tinaField(page.services_section, lang === 'en' ? 'title_en' : 'title_vi') : undefined}>
            {page?.services_section 
              ? t({ en: page.services_section.title_en || 'Our Services', vi: page.services_section.title_vi || 'Dịch vụ của chúng tôi' }, lang)
              : t({ en: 'Our Services', vi: 'Dịch vụ của chúng tôi' }, lang)
            }
          </h2>
          <p 
            className='text-gray-600 max-w-2xl mx-auto'
            data-tina-field={page?.services_section ? tinaField(page.services_section, lang === 'en' ? 'description_en' : 'description_vi') : undefined}>
            {page?.services_section
              ? t({ 
                  en: page.services_section.description_en || 'We offer comprehensive wedding planning services to make your special day perfect',
                  vi: page.services_section.description_vi || 'Chúng tôi cung cấp dịch vụ tổ chức tiệc cưới toàn diện để ngày đặc biệt của bạn trở nên hoàn hảo'
                }, lang)
              : t({ 
                  en: 'We offer comprehensive wedding planning services to make your special day perfect',
                  vi: 'Chúng tôi cung cấp dịch vụ tổ chức tiệc cưới toàn diện để ngày đặc biệt của bạn trở nên hoàn hảo'
                }, lang)
            }
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {services.map((service: any, index: number) => (
            <div key={index} className='text-center'>
              <h3 className='text-xl font-medium text-gray-900 mb-3'>
                {t({ en: service.en, vi: service.vi }, lang)}
              </h3>
              <p className='text-gray-600'>
                {t(service.desc, lang)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomeClient({ data, variables, query, lang }: HomeClientProps) {
  const { data: tinaData } = useTina({ data, variables, query });
  const page = tinaData.page;

  return (
    <div className='min-h-screen bg-white'>
      <Header lang={lang} />
      <HeroSection lang={lang} page={page} />
      <ServicesSection lang={lang} page={page} />
      <Footer lang={lang} />
    </div>
  );
}
