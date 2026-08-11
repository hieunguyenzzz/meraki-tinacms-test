'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Split out of src/app/(bare)/page.tsx so that page can stay a server component
// and export metadata — a 'use client' module cannot.
export default function LanguageRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Simple language detection based on browser language
    const preferredLang = navigator.language?.includes('vi') ? 'vi' : 'en';
    router.replace(`/${preferredLang}`);
  }, [router]);

  return null;
}
