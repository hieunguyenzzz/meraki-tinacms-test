interface FooterProps {
  lang: string;
}

// Helper function to get localized text
const t = (text: { en: string; vi: string }, lang: string) => 
  lang === 'en' ? text.en : text.vi;

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className='bg-gray-900 text-white py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid md:grid-cols-4 gap-8'>
          <div>
            <h3 className='text-xl font-bold mb-4'>Meraki</h3>
            <p className='text-gray-400'>
              {t({ 
                en: 'Creating beautiful weddings with love and passion',
                vi: 'Tạo nên những đám cưới đẹp với tình yêu và đam mê'
              }, lang)}
            </p>
          </div>
          <div>
            <h4 className='font-medium mb-4'>
              {t({ en: 'Services', vi: 'Dịch vụ' }, lang)}
            </h4>
            <ul className='space-y-2 text-gray-400'>
              <li>{t({ en: 'Wedding Planning', vi: 'Tổ chức tiệc cưới' }, lang)}</li>
              <li>{t({ en: 'Event Coordination', vi: 'Điều phối sự kiện' }, lang)}</li>
              <li>{t({ en: 'Venue Selection', vi: 'Chọn địa điểm' }, lang)}</li>
            </ul>
          </div>
          <div>
            <h4 className='font-medium mb-4'>
              {t({ en: 'Quick Links', vi: 'Liên kết nhanh' }, lang)}
            </h4>
            <ul className='space-y-2 text-gray-400'>
              <li>
                <a href={`/${lang}/about`} className='hover:text-white'>
                  {t({ en: 'About', vi: 'Giới thiệu' }, lang)}
                </a>
              </li>
              <li>
                <a href={`/${lang}/journal`} className='hover:text-white'>
                  {t({ en: 'Portfolio', vi: 'Danh mục' }, lang)}
                </a>
              </li>
              <li>
                <a href={`/${lang}/testimonials`} className='hover:text-white'>
                  {t({ en: 'Testimonials', vi: 'Lời cảm ơn' }, lang)}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className='font-medium mb-4'>
              {t({ en: 'Contact', vi: 'Liên hệ' }, lang)}
            </h4>
            <p className='text-gray-400 text-sm'>
              Email: hello@meraki-wedding.com
              <br />
              Phone: +84 123 456 789
            </p>
          </div>
        </div>
        <div className='border-t border-gray-800 mt-8 pt-8 text-center text-gray-400'>
          <p>&copy; 2024 Meraki Wedding Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
