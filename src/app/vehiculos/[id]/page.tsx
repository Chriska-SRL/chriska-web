'use client';

import { useParams } from 'next/navigation';
import { SideBar, Content, ClientOnly } from '@/components';
import { Flex } from '@chakra-ui/react';

export default function VehicleCostsPage() {
  const params = useParams();
  const id = Number(params?.id);

  if (isNaN(id)) return <div>ID inválido</div>;

  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="vehiculo" />
        <Content>
          {/* <VehicleCosts vehicleId={id} /> */}
          <div></div>
        </Content>
      </Flex>
    </ClientOnly>
  );
}
