'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ReactNode } from 'react';
import theme from '@/theme/theme.client';
import { UserHydrator } from '@/components/UserHydrator';

export const ChakraProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ChakraProvider theme={theme}>
      <UserHydrator />
      {children}
    </ChakraProvider>
  );
};
