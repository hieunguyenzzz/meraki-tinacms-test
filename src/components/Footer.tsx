interface FooterProps {
  lang: string;
}

// Helper function to get localized text
const t = (text: { en: string; vi: string }, lang: string) => 
  lang === 'en' ? text.en : text.vi;

export default function Footer({ lang }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-background-base text-text-primary py-16'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-4 gap-12 mb-12'>
          {/* Brand Column */}
          <div>
            <img src='/logo.svg' alt='Meraki' className='h-10 w-auto mb-6' />
            <div className='space-y-2 text-body-sm text-text-secondary'>
              <p>
                {t(
                  {
                    en: 'Address: Q2, No. 64 37 Street, An Phu An Khanh Urban Area, Thu Duc, Ho Chi Minh City',
                    vi: 'Địa chỉ: Q2, Số 64 Đường 37, Khu đô thị An Phú An Khánh, Thủ Đức, TP. Hồ Chí Minh',
                  },
                  lang
                )}
              </p>
              <p>Tel: (+82) 965492092</p>
              <p>Email: contact@merakiwp.com</p>
            </div>
            {/* Social Icons */}
            <div className='flex gap-4 mt-6'>
              <a
                href='https://instagram.com/meraki'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text-primary hover:text-text-accent transition-colors'
                aria-label='Instagram'>
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                </svg>
              </a>
              <a
                href='https://facebook.com/meraki'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text-primary hover:text-text-accent transition-colors'
                aria-label='Facebook'>
                <svg
                  className='w-6 h-6'
                  fill='currentColor'
                  viewBox='0 0 24 24'>
                  <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Service Column */}
          <div>
            <h4 className='text-h4 mb-6'>
              {t({ en: 'Service', vi: 'Dịch vụ' }, lang)}
            </h4>
            <ul className='space-y-3 text-body-sm text-text-secondary'>
              <li>
                <a
                  href={`/${lang}/service#city-wedding`}
                  className='hover:text-text-primary transition-colors'>
                  {t(
                    { en: 'City Wedding', vi: 'Tiệc cưới trong thành phố' },
                    lang
                  )}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/service#destination-wedding`}
                  className='hover:text-text-primary transition-colors'>
                  {t(
                    { en: 'Destination Wedding', vi: 'Tiệc cưới điểm đến' },
                    lang
                  )}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/journal`}
                  className='hover:text-text-primary transition-colors'>
                  {t({ en: 'Our Journals', vi: 'Nhật ký của chúng tôi' }, lang)}
                </a>
              </li>
            </ul>
          </div>

          {/* Insights Column */}
          <div>
            <h4 className='text-h4 mb-6'>
              {t({ en: 'Insights', vi: 'Góc nhìn' }, lang)}
            </h4>
            <ul className='space-y-3 text-body-sm text-text-secondary'>
              <li>
                <a
                  href={`/${lang}/blog`}
                  className='hover:text-text-primary transition-colors'>
                  {t({ en: 'Blogs', vi: 'Chia sẻ' }, lang)}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/love-notes`}
                  className='hover:text-text-primary transition-colors'>
                  {t({ en: 'Love Notes', vi: 'Lời tri ân' }, lang)}
                </a>
              </li>
              <li>
                <a
                  href={`/${lang}/about-us`}
                  className='hover:text-text-primary transition-colors'>
                  {t({ en: 'Meet Us', vi: 'Gặp gỡ chúng tôi' }, lang)}
                </a>
              </li>
            </ul>
          </div>

          {/* Empty column for spacing */}
          <div></div>
        </div>

        {/* Copyright */}
        <div className='border-t border-line-secondary pt-8 text-center'>
          <p className='text-body-sm text-text-secondary'>
            Copyright © {currentYear} Meraki Wedding Planner
          </p>
        </div>
      </div>
    </footer>
  );
}
