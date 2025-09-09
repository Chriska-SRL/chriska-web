'use client';

import { NextPage } from 'next';
import { ClientOnly, Content, SideBar, ClientReceipts } from '@/components';
import { Flex } from '@chakra-ui/react';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ClientReceiptPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewReceipts = useUserStore((s) => s.hasPermission(Permission.VIEW_RECEIPTS));

  useEffect(() => {
    if (isHydrated && !canViewReceipts) {
      router.push('/');
    }
  }, [isHydrated, canViewReceipts, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="pagos-de-clientes" />
        <Content>
          <ClientReceipts />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default ClientReceiptPage;
