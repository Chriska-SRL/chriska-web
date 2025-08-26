'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Distributions } from '@/components/Distributions/Distributions';
import { Flex } from '@chakra-ui/react';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission } from '@/enums/permission.enum';

const DistributionsPage: NextPage = () => {
  const router = useRouter();
  const isHydrated = useUserStore((s) => s.isHydrated);
  const canViewDistributions = useUserStore((s) => s.hasPermission(Permission.VIEW_DISTRIBUTIONS));

  useEffect(() => {
    if (isHydrated && !canViewDistributions) {
      router.push('/');
    }
  }, [isHydrated, canViewDistributions, router]);

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="repartos" />
        <Content>
          <Distributions />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default DistributionsPage;
