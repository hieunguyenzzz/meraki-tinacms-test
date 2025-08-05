'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Simple language detection based on browser language
    const preferredLang = navigator.language?.includes('vi') ? 'vi' : 'en';
    router.replace(`/${preferredLang}`);
  }, [router]);

  return null;
}
