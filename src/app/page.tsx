'use client';

import { Flex, Spinner, Box } from '@chakra-ui/react';
import { SideBar, Content, WelcomePanel, ClientOnly } from '../components';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    }
  }, [isHydrated, isLoggedIn, router]);

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
      <Flex>
        <SideBar />
        <Content>
          <WelcomePanel />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default HomePage;
