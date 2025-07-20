// components/StoreInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';

export const StoreInitializer = ({ children }: { children: React.ReactNode }) => {
  const initializeFromStorage = useUserStore((s) => s.initializeFromStorage);
  const isHydrated = useUserStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      initializeFromStorage();
    }
  }, [initializeFromStorage, isHydrated]);

  return <>{children}</>;
};
