'use client';

import { NextPage } from 'next';
import { Login, ClientOnly } from '@/components';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Flex, Spinner, Box } from '@chakra-ui/react';

const LoginPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const user = useUserStore((s) => s.user);

  useEffect(() => {
    if (isHydrated && isLoggedIn && user) {
      if (user.needsPasswordChange) {
        router.replace('/cambiar-contrasena');
      } else {
        router.replace('/');
      }
    }
  }, [isHydrated, isLoggedIn, user, router]);

  if (!isHydrated || isLoggedIn) {
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
      <Login />
    </ClientOnly>
  );
};

export default LoginPage;
