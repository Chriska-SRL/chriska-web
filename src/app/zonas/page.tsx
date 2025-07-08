'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Zones } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PermissionId } from '@/entities/permissions/permissionId';

const ZonesPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewZones = useUserStore((s) => s.hasPermission(PermissionId.VIEW_ZONES));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewZones) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewZones, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="zonas" />
        <Content>
          <Zones />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default ZonesPage;
