'use client';

import { useParams } from 'next/navigation';
import { SideBar, Content, ClientOnly } from '@/components';
import { Flex } from '@chakra-ui/react';
import { VehicleCosts } from '@/components/VehicleCost/VehicleCosts';

export default function VehicleCostsPage() {
  const params = useParams();
  const id = Number(params?.id);

  if (isNaN(id)) return <div>ID inválido</div>;

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="vehiculos" />
        <Content>
          <VehicleCosts />
        </Content>
      </Flex>
    </ClientOnly>
  );
}
