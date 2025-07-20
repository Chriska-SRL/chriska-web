'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';

export const UserHydrator = () => {
  const initializeFromStorage = useUserStore((state) => state.initializeFromStorage);

  useEffect(() => {
    // Usar el método del store que ya maneja cookies
    initializeFromStorage();
  }, [initializeFromStorage]);

  return null;
};
