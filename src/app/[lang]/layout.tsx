import Header from '../../components/Header';

interface LanguageLayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default function LanguageLayout({
  children,
  params,
}: LanguageLayoutProps) {
  return (
    <>
      <Header lang={params.lang} />
      {children}
    </>
  );
}
