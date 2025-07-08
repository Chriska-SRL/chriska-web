'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import { SideBar, Content, WelcomePanel, ClientOnly } from '../components';
import { useUserStore } from '@/stores/useUserStore';

const HomePage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, router]);

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
