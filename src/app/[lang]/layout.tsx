import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { client } from '../../../tina/__generated__/client';
import { LanguageNavigationProvider } from '../../components/LanguageNavigationContext';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default async function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  // The [lang] segment matches any string, so without this every arbitrary root
  // path (/xx, /some-bogus-path) would render the full chrome at HTTP 200 and
  // hand crawlers a nav built from the bogus segment (/some-bogus-path/journal).
  // Guarding here covers every nested route in one place.
  if (!['en', 'vi'].includes(params.lang)) {
    notFound();
  }

  const variables = { relativePath: 'index.mdx' };
  const footer = await client.queries.footer(variables);

  return (
    <LanguageNavigationProvider>
      <Header lang={params.lang} />
      {children}
      <Footer
        data={footer.data}
        query={footer.query}
        variables={variables}
        lang={params.lang}
      />
    </LanguageNavigationProvider>
  );
}
