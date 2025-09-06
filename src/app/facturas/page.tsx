'use client';

import { NextPage } from 'next';
import { ClientOnly, Content, SideBar, Purchases } from '@/components';
import { Flex } from '@chakra-ui/react';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PurchasePage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewPurchases = useUserStore((s) => s.hasPermission(Permission.VIEW_PURCHASES));

  useEffect(() => {
    if (isHydrated && !canViewPurchases) {
      router.push('/');
    }
  }, [isHydrated, canViewPurchases, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="facturas" />
        <Content>
          <Purchases />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default PurchasePage;
