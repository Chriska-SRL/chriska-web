'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly, Vehicles } from '@/components';
import { Flex } from '@chakra-ui/react';

const VehiclesPage: NextPage = () => {
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

export default VehiclesPage;
