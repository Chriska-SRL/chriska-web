'use client';

import { NextPage } from 'next';
import { Login, ClientOnly } from '@/components';
import { useUserStore } from '@/stores/useUserStore';
import { Flex, Spinner, Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage: NextPage = () => {
  const isHydrated = useUserStore((s) => s.isHydrated);
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isLoggedIn && user) {
      if (user.needsPasswordChange) {
        router.push('/cambiar-contrasena');
      } else {
        router.push('/');
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
