'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { ReturnRequests } from '@/components/ReturnRequests/ReturnRequests';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const ReturnRequestsPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewReturnRequests = useUserStore((s) => s.hasPermission(Permission.VIEW_ORDER_REQUESTS)); // Assuming similar permission

  useEffect(() => {
    if (isHydrated && !canViewReturnRequests) {
      router.push('/');
    }
  }, [isHydrated, canViewReturnRequests, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="devoluciones" />
        <Content>
          <ReturnRequests />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default ReturnRequestsPage;
