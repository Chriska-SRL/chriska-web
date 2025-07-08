'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Roles } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PermissionId } from '@/entities/permissions/permissionId';

const RolesPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewRoles = useUserStore((s) => s.hasPermission(PermissionId.VIEW_ROLES));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewRoles) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewRoles, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="roles" />
        <Content>
          <Roles />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default RolesPage;
