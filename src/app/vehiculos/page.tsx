'use client';

import { NextPage } from 'next';
import { ClientOnly, Content, SideBar, Vehicles } from '@/components';
import { Flex } from '@chakra-ui/react';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const VehiclePage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewVehicles = useUserStore((s) => s.hasPermission(Permission.VIEW_VEHICLES));

  useEffect(() => {
    if (isHydrated && !canViewVehicles) {
      router.push('/');
    }
  }, [isHydrated, canViewVehicles, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="vehiculos" />
        <Content>
          <Vehicles />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default VehiclePage;
