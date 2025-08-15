'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Discounts } from '@/components/Discounts/Discounts';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const DiscountsPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewDiscounts = useUserStore((s) => s.hasPermission(Permission.VIEW_PRODUCTS)); // Asumiendo que se usa el mismo permiso

  useEffect(() => {
    if (isHydrated && !canViewDiscounts) {
      router.push('/');
    }
  }, [isHydrated, canViewDiscounts, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="descuentos" />
        <Content>
          <Discounts />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default DiscountsPage;
