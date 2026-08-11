import Header from '../../components/Header';
import Footer from '../../components/Footer';
import NotFoundBody from '../../components/NotFoundBody';
import { client } from '../../../tina/__generated__/client';
import { LanguageNavigationProvider } from '../../components/LanguageNavigationContext';

// 404 boundary for the bare routes. (bare)/layout.tsx supplies <html>/<body>
// but no chrome, so the header and footer are assembled here. This boundary
// sits above the locale segment, so there is no locale to read — English.
const FALLBACK_LANG = 'en';

export default async function NotFound() {
  const variables = { relativePath: 'index.mdx' };
  const footer = await client.queries.footer(variables);

  return (
    <LanguageNavigationProvider>
      <Header lang={FALLBACK_LANG} />
      <NotFoundBody />
      <Footer
        data={footer.data}
        query={footer.query}
        variables={variables}
        lang={FALLBACK_LANG}
      />
    </LanguageNavigationProvider>
  );
}
