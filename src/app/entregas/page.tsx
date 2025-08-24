'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Deliveries } from '@/components/Deliveries/Deliveries';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const DeliveriesPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewDeliveries = useUserStore((s) => s.hasPermission(Permission.VIEW_DELIVERIES));

  useEffect(() => {
    if (isHydrated && !canViewDeliveries) {
      router.push('/');
    }
  }, [isHydrated, canViewDeliveries, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="entregas" />
        <Content>
          <Deliveries />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default DeliveriesPage;
