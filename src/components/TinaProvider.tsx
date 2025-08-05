'use client';

import { TinaCMSProvider } from 'tinacms/dist/react';
import { ReactNode } from 'react';

// TinaCMS Provider for the app
export default function TinaProvider({ children }: { children: ReactNode }) {
  return (
    <TinaCMSProvider>
      {children}
    </TinaCMSProvider>
  );
}
