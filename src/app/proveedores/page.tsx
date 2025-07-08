'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Suppliers } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PermissionId } from '@/entities/permissions/permissionId';

const SuppliersPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewSuppliers = useUserStore((s) => s.hasPermission(PermissionId.VIEW_SUPPLIERS));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewSuppliers) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewSuppliers, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="proveedores" />
        <Content>
          <Suppliers />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default SuppliersPage;
