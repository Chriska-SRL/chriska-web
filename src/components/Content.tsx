'use client';

import { Flex, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Content = ({ children }: { children: ReactNode }) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const outerBg = useColorModeValue('gray.100', 'gray.800');
  const innerBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100vh"
      w="100%"
      bg={outerBg}
      px={{ base: '1rem', md: '0' }}
      pt={isMobile ? '4rem' : '0'}
    >
      <Flex
        flexDir="column"
        p={{ base: '1rem', md: '1.5rem' }}
        px={{ base: '1.25rem', md: '1.75rem' }}
        w="100%"
        maxW="97rem"
        h="95%"
        m={{ base: '0.5rem', md: '1rem' }}
        bg={innerBg}
        borderRadius="0.5rem"
        border="2px solid"
        borderColor={borderColor}
        gap="1.25rem"
        overflowY="auto"
      >
        {children}
      </Flex>
    </Flex>
  );
};
