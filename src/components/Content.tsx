'use client';

import { Flex, useMediaQuery, useColorModeValue } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const Content = ({ children }: { children: ReactNode }) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const outerBg = useColorModeValue('gray.100', 'gray.800');
  const innerBg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      h="100dvh"
      w="100%"
      bg={outerBg}
      px={{ base: '0.75rem', md: '0.625rem' }}
      pt={{ base: '3.5rem', md: '0' }}
    >
      <Flex
        flexDir="column"
        p={{ base: '1rem', md: '1.5rem' }}
        px={{ base: '1.25rem', md: '1.75rem' }}
        w="100%"
        h="97%"
        bg={innerBg}
        borderRadius="0.5rem"
        border="1px solid"
        borderColor={borderColor}
        gap="1rem"
        overflowY="auto"
      >
        {children}
      </Flex>
    </Flex>
  );
};
