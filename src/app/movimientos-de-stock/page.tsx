'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, StockMovements } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PermissionId } from '@/entities/permissions/permissionId';

const StockMovementsPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewStockMovements = useUserStore((s) => s.hasPermission(PermissionId.VIEW_STOCK_MOVEMENTS));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewStockMovements) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewStockMovements, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="movimientos-de-stock" />
        <Content>
          <StockMovements />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default StockMovementsPage;
