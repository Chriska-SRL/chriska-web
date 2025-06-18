'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/useUserStore';

export const UserHydrator = () => {
  const setUserFromToken = useUserStore((state) => state.setUserFromToken);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUserFromToken(token);
    } else {
      useUserStore.setState({ isHydrated: true });
    }
  }, []);

  return null;
};
