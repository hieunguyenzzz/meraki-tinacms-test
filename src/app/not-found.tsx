import Header from '../components/Header';
import Footer from '../components/Footer';
import { client } from '../../tina/__generated__/client';
import { LanguageNavigationProvider } from '../components/LanguageNavigationContext';

// The 404 boundary sits above the [lang] segment, so there is no locale to read.
// Default to English chrome and offer the Vietnamese line alongside it.
const FALLBACK_LANG = 'en';

const links = [
  { href: '/en', label: 'Home' },
  { href: '/en/journal', label: 'Journals' },
  { href: '/en/blog', label: 'Blog' },
  { href: '/en/lets-connect', label: "Let's Connect" },
];

export default async function NotFound() {
  const variables = { relativePath: 'index.mdx' };
  const footer = await client.queries.footer(variables);

  return (
    <LanguageNavigationProvider>
      <Header lang={FALLBACK_LANG} />

      <main className='bg-background-base px-5 py-24 text-text-primary md:px-6 md:py-32'>
        <div className='mx-auto flex max-w-2xl flex-col items-center text-center'>
          <p className='text-handwriting text-text-accent'>404</p>

          <h1 className='mt-4 text-h1'>This page has wandered off</h1>

          <p className='mt-6 text-body-lg text-text-secondary'>
            The page you are looking for does not exist, or it has moved
            somewhere new. Let us point you back to the good parts.
          </p>

          <p className='mt-2 text-body-md text-text-tertiary' lang='vi'>
            Trang bạn tìm không tồn tại hoặc đã được chuyển sang địa chỉ khác.
          </p>

          <nav
            className='mt-10 flex flex-wrap justify-center gap-3'
            aria-label='Suggested pages'
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='border border-line-secondary px-5 py-2 text-body-sm text-text-primary transition-colors hover:border-line-accent hover:bg-background-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-line-accent'
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </main>

      <Footer
        data={footer.data}
        query={footer.query}
        variables={variables}
        lang={FALLBACK_LANG}
      />
    </LanguageNavigationProvider>
  );
}
