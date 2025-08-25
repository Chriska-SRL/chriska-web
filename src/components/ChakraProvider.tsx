'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode, useEffect } from 'react';
import theme from '@/theme/theme.client';
import { useUserStore } from '@/stores/useUserStore';
import { useInitializeGeolocation } from '@/hooks/useGeolocation';

export const ChakraProviders = ({ children }: { children: ReactNode }) => {
  const initializeFromStorage = useUserStore((state) => state.initializeFromStorage);

  // Inicializar geolocalización
  useInitializeGeolocation();

  useEffect(() => {
    initializeFromStorage();
  }, [initializeFromStorage]);

  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
