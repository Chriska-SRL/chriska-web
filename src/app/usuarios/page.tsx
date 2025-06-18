'use client';

import { NextPage } from 'next';
import { SideBar, Content, Users } from '@/components';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const UsersPage: NextPage = () => {
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
        <SideBar currentPage="usuarios" />
        <Content>
          <Users />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default UsersPage;
