'use client';

import { NextPage } from 'next';
import { ClientOnly, PasswordReset } from '@/components';
import { useUserStore } from '@/stores/useUserStore';
import { Flex, Spinner, Box } from '@chakra-ui/react';

const PasswordResetPage: NextPage = () => {
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);

  if (!isHydrated || !isLoggedIn) {
    return (
      <Flex height="100dvh" justifyContent="center" alignItems="center">
        <Box textAlign="center">
          <Spinner size="lg" color="blue.500" />
        </Box>
      </Flex>
    );
  }

  return (
    <ClientOnly>
      <PasswordReset />
    </ClientOnly>
  );
};

export default PasswordResetPage;
