'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Clients } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ClientsPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    }
  }, [isLoggedIn, isHydrated, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="clientes" />
        <Content>
          <Clients />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default ClientsPage;
