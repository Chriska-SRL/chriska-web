'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Users } from '@/components';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PermissionId } from '@/entities/permissions/permissionId';

const UsersPage: NextPage = () => {
  const router = useRouter();
  const isLoggedIn = useUserStore((s) => s.isLoggedIn);
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewUsers = useUserStore((s) => s.hasPermission(PermissionId.VIEW_USERS));

  useEffect(() => {
    if (isHydrated && !isLoggedIn) {
      router.push('/iniciar-sesion');
    } else if (isHydrated && !canViewUsers) {
      router.push('/');
    }
  }, [isLoggedIn, isHydrated, canViewUsers, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="usuarios" />
        <Content>
          <Users />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default UsersPage;
