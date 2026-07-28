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
