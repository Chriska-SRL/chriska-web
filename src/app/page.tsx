'use client';

import { Flex, Spinner, Box } from '@chakra-ui/react';
import { SideBar, Content, WelcomePanel, ClientOnly } from '../components';
import { useUserStore } from '@/stores/useUserStore';

const HomePage = () => {
  const isHydrated = useUserStore((state) => state.isHydrated);

  if (!isHydrated) {
    return (
      <Flex height="100dvh" justifyContent="center" alignItems="center">
        <Box textAlign="center">
          <Spinner size="lg" color="blue.500" />
        </Box>
      </Flex>
    );
  }

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
