'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Categories } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const CategoriesPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewCategories = useUserStore((s) => s.hasPermission(Permission.VIEW_CATEGORIES));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewCategories) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewCategories, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="categorias" />
        <Content>
          <Categories />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default CategoriesPage;
