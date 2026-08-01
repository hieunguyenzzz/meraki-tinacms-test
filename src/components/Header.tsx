'use client';

import { usePathname } from 'next/navigation';
import { type AnimationEvent, useEffect, useRef, useState } from 'react';
import { useLanguageNavigation } from './LanguageNavigationContext';

interface HeaderProps {
  lang: string;
}

// Navigation items configuration
const navItems = [
  { path: '', key: 'home', en: 'Home', vi: 'Trang chủ' },
  { path: '/journal', key: 'journal', en: 'Journals', vi: 'Nhật ký' },
  { path: '/service', key: 'service', en: 'Service', vi: 'Dịch vụ' },
  { path: '/about', key: 'about', en: 'About Us', vi: 'Gặp gỡ' },
  { path: '/blog', key: 'blog', en: 'Blog', vi: 'Blog' },
  {
    path: '/love-notes',
    key: 'loveNotes',
    en: 'Love Notes',
    vi: 'Love Notes',
  },
  { path: '/lets-connect', key: 'connect', en: "Let's Connect", vi: 'Liên hệ' },
];

// Helper function to get localized text
const t = (text: { en: string; vi: string }, lang: string) =>
  lang === 'en' ? text.en : text.vi;

const MOBILE_HEADER_HEIGHT = 56;
const SCROLL_DIRECTION_THRESHOLD = 4;
type MobileHeaderState = 'default' | 'visible' | 'hiding';

export default function Header({ lang }: HeaderProps) {
  const pathname = usePathname();
  const { localizedPaths } = useLanguageNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileHeaderState, setMobileHeaderState] =
    useState<MobileHeaderState>('default');
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuWasOpenRef = useRef(false);
  const mobileHeaderStateRef = useRef<MobileHeaderState>('default');

  useEffect(() => {
    if (!isMenuOpen) {
      if (menuWasOpenRef.current) {
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
      menuWasOpenRef.current = false;
      return;
    }

    menuWasOpenRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuPanelRef.current?.focus();

    const handleMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements =
        menuPanelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );

      if (!focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    const closeAtDesktopWidth = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    const desktopMediaQuery = window.matchMedia('(min-width: 744px)');
    window.addEventListener('keydown', handleMenuKeyDown);
    desktopMediaQuery.addEventListener('change', closeAtDesktopWidth);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleMenuKeyDown);
      desktopMediaQuery.removeEventListener('change', closeAtDesktopWidth);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
    mobileHeaderStateRef.current = 'default';
    setMobileHeaderState('default');
  }, [pathname]);

  useEffect(() => {
    const mobileMediaQuery = window.matchMedia('(max-width: 743px)');
    const reducedMotionMediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );
    let lastScrollY = Math.max(0, window.scrollY);

    const updateMobileHeaderState = (state: MobileHeaderState) => {
      mobileHeaderStateRef.current = state;
      setMobileHeaderState(state);
    };

    const resetMobileHeader = () => updateMobileHeaderState('default');

    const showMobileHeader = () => updateMobileHeaderState('visible');

    const hideMobileHeader = () => {
      if (mobileHeaderStateRef.current === 'default') {
        return;
      }

      updateMobileHeaderState(
        reducedMotionMediaQuery.matches ? 'default' : 'hiding'
      );
    };

    const handleScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);

      if (!mobileMediaQuery.matches) {
        resetMobileHeader();
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= MOBILE_HEADER_HEIGHT) {
        resetMobileHeader();
        lastScrollY = currentScrollY;
        return;
      }

      const scrollDelta = currentScrollY - lastScrollY;
      if (Math.abs(scrollDelta) < SCROLL_DIRECTION_THRESHOLD) {
        return;
      }

      if (scrollDelta < 0) {
        showMobileHeader();
      } else {
        hideMobileHeader();
      }
      lastScrollY = currentScrollY;
    };

    const handleViewportChange = () => {
      lastScrollY = Math.max(0, window.scrollY);
      resetMobileHeader();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    mobileMediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mobileMediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  const handleHeaderAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (mobileHeaderStateRef.current === 'hiding') {
      mobileHeaderStateRef.current = 'default';
      setMobileHeaderState('default');
    }
  };

  // Function to check if a nav item is active
  const isActive = (itemPath: string) => {
    // Remove language prefix from pathname
    const pathWithoutLang = pathname.replace(`/${lang}`, '') || '/';

    // For home page
    if (itemPath === '' && pathWithoutLang === '/') {
      return true;
    }

    // For other pages, check if current path starts with the item path
    if (itemPath !== '' && pathWithoutLang.startsWith(itemPath)) {
      return true;
    }

    return false;
  };

  // Function to get the language-switched URL
  const getLanguageSwitchUrl = (targetLang: string) => {
    const localizedPath = localizedPaths?.[targetLang as 'en' | 'vi'];
    if (localizedPath) {
      return localizedPath;
    }

    // Remove current language prefix from pathname
    const pathWithoutLang = pathname.replace(`/${lang}`, '') || '/';
    // Return new path with target language
    return `/${targetLang}${pathWithoutLang === '/' ? '' : pathWithoutLang}`;
  };

  return (
    <>
      <header
        className={`${mobileHeaderState === 'visible'
          ? 'sticky motion-safe:animate-header-slide-down md:animate-none'
          : mobileHeaderState === 'hiding'
            ? 'sticky motion-safe:animate-header-slide-up md:animate-none'
            : 'relative'
          } top-0 z-50 flex h-14 items-center justify-between bg-background-base px-5 shadow-sm md:sticky md:h-16 md:px-6`}
        onAnimationEnd={handleHeaderAnimationEnd}
      >
        <div className="flex-shrink-0">
          <a href={`/${lang}`} className="block" aria-label="Meraki home">
            <img
              src="/logo.svg"
              alt="Meraki"
              loading="lazy"
              className="h-8 w-auto"
            />
          </a>
        </div>

        <nav className="mx-auto hidden md:block" aria-label="Main navigation">
          <div className="flex items-baseline space-x-3 lg:space-x-4">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <a
                  key={item.key}
                  href={`/${lang}${item.path}`}
                  className={`px-3 py-2 text-body-sm transition-all underline-offset-4 decoration-2 ${active
                    ? 'text-text-primary underline'
                    : 'text-text-secondary hover:-translate-y-[2px] hover:underline'
                    }`}
                >
                  {t({ en: item.en, vi: item.vi }, lang)}
                </a>
              );
            })}
          </div>
        </nav>

        <div className="hidden items-center space-x-2 md:flex">
          {['en', 'vi'].map((language) => (
            <a
              key={language}
              href={getLanguageSwitchUrl(language)}
              className={`rounded px-2 py-1 text-sm transition-colors ${lang === language
                ? 'bg-background-brand text-background-base'
                : 'text-text-secondary hover:bg-background-1 hover:text-text-primary'
                }`}
            >
              {language.toUpperCase()}
            </a>
          ))}
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex h-8 w-8 items-center justify-end text-shape-primary transition-colors hover:text-shape-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-line-accent md:hidden"
          aria-label="Open navigation menu"
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(true)}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              d="M1 4.5h18M1 10h18M1 15.5h18"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
      </header>

      {isMenuOpen && (
        <div
          ref={menuPanelRef}
          id="mobile-navigation"
          className="fixed inset-0 z-[60] min-h-[100dvh] overflow-y-auto bg-background-base outline-none md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
          tabIndex={-1}
        >
          <div className="flex h-14 items-center justify-between px-5">
            <a
              href={`/${lang}`}
              className="block"
              aria-label="Meraki home"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src="/logo.svg"
                alt="Meraki"
                loading="lazy"
                className="h-8 w-auto"
              />
            </a>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-end text-shape-primary transition-colors hover:text-shape-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-line-accent"
              aria-label="Close navigation menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 16 16"
                aria-hidden="true"
              >
                <path
                  d="M2 2l12 12M14 2 2 14"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>

          <nav
            className="px-[35px] pb-6 pt-10"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-5">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={`/${lang}${item.path}`}
                  className={`flex w-fit items-center gap-3 border-b pb-1 font-vocago text-[32px] leading-10 text-text-primary transition-colors focus-visible:outline-none ${isActive(item.path)
                    ? 'border-text-primary'
                    : 'border-transparent hover:border-text-primary focus-visible:border-text-primary'
                    }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t({ en: item.en, vi: item.vi }, lang)}
                </a>
              ))}
            </div>

            <div
              className="mt-10 flex justify-center"
              role="group"
              aria-label="Choose language"
            >
              {['en', 'vi'].map((language) => (
                <a
                  key={language}
                  href={getLanguageSwitchUrl(language)}
                  className={`flex h-7 w-[54px] items-center justify-center border border-line-secondary font-bt-beau-sans text-sm transition-colors ${lang === language
                    ? 'border-background-brand bg-background-brand text-background-base'
                    : 'bg-background-base text-text-secondary hover:bg-background-1 hover:text-text-primary'
                    } ${language === 'vi' ? '-ml-px' : ''}`}
                  aria-current={lang === language ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? 'ENG' : 'VIE'}
                </a>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
