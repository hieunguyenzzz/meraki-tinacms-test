import '../globals.css';
import 'animate.css';
import Analytics from '../../components/Analytics';
import DocumentHead from '../../components/DocumentHead';
import { baseMetadata } from '../baseMetadata';

export const metadata = baseMetadata;

// Root layout for the routes that sit outside the [lang] segment: `/` and the
// 404. Both are English by definition — `/` is the language chooser itself and
// the 404 renders English chrome — so the locale is fixed here. Everything
// under /en and /vi gets its lang from src/app/[lang]/layout.tsx instead.
export default function BareRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head>
        <DocumentHead />
      </head>
      <body className='bg-background-1'>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
