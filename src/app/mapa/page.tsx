'use client';

import { NextPage } from 'next';
import { SideBar, Content, ClientOnly } from '@/components';
import MapUruguay from '@/components/MapUruguay';
import { Flex, Box } from '@chakra-ui/react';

const MapaPage: NextPage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar currentPage="mapa" />
        <Content>
          <Box h="100%" w="100%">
            <MapUruguay />
          </Box>
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default MapaPage;
