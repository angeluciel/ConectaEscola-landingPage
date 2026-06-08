'use client';

import { createContext, useContext } from 'react';

interface PreloaderContextValue {
  isLoading: boolean;
  isReady: boolean;
  registerResource: (promise: Promise<void>) => void;
}

export const PreloaderContext = createContext<PreloaderContextValue | null>(
  null,
);

export function usePreloader() {
  const value = useContext(PreloaderContext);
  if (!value) {
    throw new Error('usePreloader must be used inside <Preloader />');
  }
  return value;
}
