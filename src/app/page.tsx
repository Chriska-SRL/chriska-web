'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flex } from '@chakra-ui/react';
import { SideBar, Content, WelcomePanel } from '../components';
import { ClientOnly } from '@/components/ClientOnly';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/iniciar-sesion');
    }
  }, [router]);

  return (
    <ClientOnly>
      <Flex bg="#f7f7f7">
        <SideBar />
        <Content>
          <WelcomePanel />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default HomePage;
