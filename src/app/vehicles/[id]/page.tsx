'use client';

import { useParams } from 'next/navigation';
import { SideBar, Content } from '@/components';
import { VehicleCosts } from '@/components/Vehicles/VehicleCosts';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';

export default function VehicleCostsPage() {
  const params = useParams();
  const id = Number(params?.id);

  if (isNaN(id)) return <div>ID inválido</div>;

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="vehicle" />
        <Content>
          <VehicleCosts vehicleId={id} />
        </Content>
      </Flex>
    </ClientOnly>
  );
}
