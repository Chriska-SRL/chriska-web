'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Orders } from '@/components/Orders/Orders';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const OrdersPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewOrders = useUserStore((s) => s.hasPermission(Permission.VIEW_ORDERS)); // Assuming same permission for now

  useEffect(() => {
    if (isHydrated && !canViewOrders) {
      router.push('/');
    }
  }, [isHydrated, canViewOrders, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="ordenes" />
        <Content>
          <Orders />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default OrdersPage;
