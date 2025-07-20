'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, StockMovements } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const StockMovementsPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewStockMovements = useUserStore((s) => s.hasPermission(Permission.VIEW_STOCK_MOVEMENTS));

  useEffect(() => {
    if (isHydrated && !canViewStockMovements) {
      router.push('/');
    }
  }, [isHydrated, canViewStockMovements, router]);

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
