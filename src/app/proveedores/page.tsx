'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Suppliers } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const SuppliersPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewSuppliers = useUserStore((s) => s.hasPermission(Permission.VIEW_SUPPLIERS));

  useEffect(() => {
    if (isHydrated && !canViewSuppliers) {
      router.push('/');
    }
  }, [isHydrated, canViewSuppliers, router]);

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
