'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Warehouses } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const WarehousesPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewWarehouses = useUserStore((s) => s.hasPermission(Permission.VIEW_WAREHOUSES));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewWarehouses) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewWarehouses, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="depositos-y-estanterias" />
        <Content>
          <Warehouses />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default WarehousesPage;
