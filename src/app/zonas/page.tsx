'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Zones } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const ZonesPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewZones = useUserStore((s) => s.hasPermission(Permission.VIEW_ZONES));

  useEffect(() => {
    if (isHydrated && !canViewZones) {
      router.push('/');
    }
  }, [isHydrated, canViewZones, router]);

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
