import '../globals.css';
import 'animate.css';
import Analytics from '../../components/Analytics';
import DocumentHead from '../../components/DocumentHead';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { client } from '../../../tina/__generated__/client';
import { LanguageNavigationProvider } from '../../components/LanguageNavigationContext';
import { baseMetadata } from '../baseMetadata';
import { isLocale } from '../../lib/locale';

export const metadata = baseMetadata;

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

// This is a root layout, not a nested one: only a root layout may render <html>,
// and <html lang> has to follow the [lang] segment. That is why there is no
// src/app/layout.tsx — the bare routes get their own root layout under (bare).
export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  // The [lang] segment matches any string, so /xx and /some-bogus-path reach
  // this layout too. Rejecting them is the pages' job — see assertLocale in
  // src/lib/locale.ts for why it cannot happen here — but the document still
  // has to render around that 404, so fall back to English rather than emitting
  // <html lang="some-bogus-path">.
  const lang = isLocale(params.lang) ? params.lang : 'en';

  const variables = { relativePath: 'index.mdx' };
  const footer = await client.queries.footer(variables);

  return (
    <html lang={lang}>
      <head>
        <DocumentHead />
      </head>
      <body className='bg-background-1'>
        <LanguageNavigationProvider>
          <Header lang={lang} />
          {children}
          <Footer
            data={footer.data}
            query={footer.query}
            variables={variables}
            lang={lang}
          />
        </LanguageNavigationProvider>
        <Analytics />
      </body>
    </html>
  );
}
