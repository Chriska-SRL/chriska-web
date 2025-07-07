'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Clients } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PermissionId } from '@/entities/permissions/permissionId';

const ClientsPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewClients = useUserStore((s) => s.hasPermission(PermissionId.VIEW_CLIENTS));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewClients) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewClients, router]);

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
