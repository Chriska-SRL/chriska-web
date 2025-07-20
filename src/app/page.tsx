// page.tsx
'use client';

import { Flex } from '@chakra-ui/react';
import { SideBar, Content, WelcomePanel, ClientOnly } from '../components';

const HomePage = () => {
  return (
    <ClientOnly>
      <Flex>
        <SideBar />
        <Content>
          <WelcomePanel />
        </Content>
      </Flex>
    </ClientOnly>
  );
};

export default HomePage;
