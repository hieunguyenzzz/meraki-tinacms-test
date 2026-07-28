'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

type LocalizedPaths = Partial<Record<'en' | 'vi', string>>;

interface LanguageNavigationContextValue {
  localizedPaths: LocalizedPaths | null;
  setLocalizedPaths: (paths: LocalizedPaths | null) => void;
}

const LanguageNavigationContext =
  createContext<LanguageNavigationContextValue | null>(null);

export function LanguageNavigationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [localizedPaths, setPaths] = useState<LocalizedPaths | null>(null);
  const setLocalizedPaths = useCallback(
    (paths: LocalizedPaths | null) => setPaths(paths),
    []
  );
  const value = useMemo(
    () => ({ localizedPaths, setLocalizedPaths }),
    [localizedPaths, setLocalizedPaths]
  );

  return (
    <LanguageNavigationContext.Provider value={value}>
      {children}
    </LanguageNavigationContext.Provider>
  );
}

export function useLanguageNavigation() {
  const context = useContext(LanguageNavigationContext);

  if (!context) {
    throw new Error(
      'useLanguageNavigation must be used within LanguageNavigationProvider'
    );
  }

  return context;
}
