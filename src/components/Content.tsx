'use client';

import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Content = ({ children }: { children: ReactNode }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      w="100%"
      bg="#f7f7f7"
      px={{ base: '1rem', md: '0' }}
      pt={isMobile ? '4rem' : '0'} // 👈 compensación por navbar fijo
    >
      <Flex
        flexDir="column"
        p={{ base: '1rem', md: '1.5rem' }}
        px={{ base: '1.25rem', md: '1.75rem' }}
        w="100%"
        maxW="97rem"
        h="95%"
        m={{ base: '0.5rem', md: '1rem' }}
        bg="white"
        borderRadius="0.5rem"
        border="2px solid"
        borderColor="#f2f2f2"
        gap="1.25rem"
        overflowY="auto"
      >
        {children}
      </Flex>
    </Flex>
  );
};
