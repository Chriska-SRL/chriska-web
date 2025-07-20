'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Brands } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const BrandsPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewProducts = useUserStore((s) => s.hasPermission(Permission.VIEW_PRODUCTS));

  useEffect(() => {
    if (isHydrated && !canViewProducts) {
      router.push('/');
    }
  }, [isHydrated, canViewProducts, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="marcas" />
        <Content>
          <Brands />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default BrandsPage;
