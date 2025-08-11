interface HeaderProps {
  lang: string;
}

// Navigation items configuration
const navItems = [
  { path: '', key: 'home', en: 'Home', vi: 'Trang chủ' },
  { path: '/journal', key: 'journal', en: 'Journal', vi: 'Nhật ký' },
  { path: '/service', key: 'service', en: 'Service', vi: 'Dịch vụ' },
  { path: '/about-us', key: 'about', en: 'About Us', vi: 'Giới thiệu' },
  { path: '/blog', key: 'blog', en: 'Blog', vi: 'Blog' },
  { path: '/love-notes', key: 'loveNotes', en: 'Love Notes', vi: 'Lời cảm ơn' },
  { path: '/lets-connect', key: 'connect', en: "Let's Connect", vi: 'Liên hệ' },
  { path: '/social-media', key: 'social', en: 'Social Media', vi: 'Mạng xã hội' },
];

// Helper function to get localized text
const t = (text: { en: string; vi: string }, lang: string) => 
  lang === 'en' ? text.en : text.vi;

export default function Header({ lang }: HeaderProps) {
  return (
    <header className='sticky top-0 z-50 bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <a href={`/${lang}`} className='text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors'>
              Meraki
            </a>
          </div>

          {/* Navigation */}
          <nav className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              {navItems.map((item, index) => (
                <a
                  key={item.key}
                  href={`/${lang}${item.path}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    index === 0 
                      ? 'text-gray-900 hover:text-gray-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  {t({ en: item.en, vi: item.vi }, lang)}
                </a>
              ))}
            </div>
          </nav>

          {/* Language Switcher */}
          <div className='flex items-center space-x-2'>
            {['en', 'vi'].map((l) => (
              <a
                key={l}
                href={`/${l}`}
                className={`px-2 py-1 text-sm rounded transition-colors ${
                  lang === l
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}>
                {l.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Mobile menu button (for future mobile implementation) */}
          <div className='md:hidden'>
            <button 
              type="button" 
              className='text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 transition-colors'
              aria-label="Toggle navigation">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
