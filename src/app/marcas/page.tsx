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
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewProducts = useUserStore((s) => s.hasPermission(Permission.VIEW_PRODUCTS));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewProducts) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewProducts, router]);

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
