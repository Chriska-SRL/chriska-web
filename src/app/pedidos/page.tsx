'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { OrderRequests } from '@/components/OrderRequests/OrderRequests';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const OrderRequestsPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewOrderRequests = useUserStore((s) => s.hasPermission(Permission.VIEW_ORDER_REQUESTS));

  useEffect(() => {
    if (isHydrated && !canViewOrderRequests) {
      router.push('/');
    }
  }, [isHydrated, canViewOrderRequests, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="pedidos" />
        <Content>
          <OrderRequests />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default OrderRequestsPage;
