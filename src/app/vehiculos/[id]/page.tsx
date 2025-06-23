'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import { Flex } from '@chakra-ui/react';
import { VehicleCosts } from '@/components/VehicleCost/VehicleCosts';

const VehicleCostPage: NextPage = () => {
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
};

export default VehicleCostPage;
