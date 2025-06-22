'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Roles } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const RolesPage: NextPage = () => {
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
        <SideBar currentPage="roles" />
        <Content>
          <Roles />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default RolesPage;
