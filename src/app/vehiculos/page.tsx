'use client';

import { NextPage } from 'next';
import { ClientOnly, Content, SideBar, Vehicles } from '@/components';
import { Flex } from '@chakra-ui/react';

const VehicleCostPage: NextPage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="vehiculos" />
        <Content>
          <Vehicles />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default VehicleCostPage;
