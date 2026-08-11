import { notFound } from 'next/navigation';

export const LOCALES = ['en', 'vi'] as const;

export function isLocale(lang: string): boolean {
  return (LOCALES as readonly string[]).includes(lang);
}

/**
 * Reject an unsupported [lang] segment with a real 404.
 *
 * This has to live in the pages rather than in src/app/[lang]/layout.tsx: that
 * layout is a root layout (it owns <html lang>), and when a root layout calls
 * notFound() Next has no document shell left to render the 404 into, so it
 * falls back to its own bare error page instead of src/app/[lang]/not-found.tsx.
 */
export function assertLocale(lang: string): void {
  if (!isLocale(lang)) {
    notFound();
  }
}
