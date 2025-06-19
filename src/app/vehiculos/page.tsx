'use client';

import { NextPage } from 'next';
import { SideBar, Content } from '@/components';
import { Vehicles } from '@/components/Vehicles/Vehicles';
import { Flex } from '@chakra-ui/react';
import { ClientOnly } from '@/components/ClientOnly';

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
