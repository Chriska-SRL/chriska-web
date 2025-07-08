'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Flex } from '@chakra-ui/react';
import { VehicleCosts } from '@/components/VehicleCost/VehicleCosts';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const VehicleCostPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewVehicles = useUserStore((s) => s.hasPermission(PermissionId.VIEW_VEHICLES));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewVehicles) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewVehicles, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="vehiculos" />
        <Content>
          <VehicleCosts />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default VehicleCostPage;
