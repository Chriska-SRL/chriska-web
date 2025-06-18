'use client';

import { Flex, Text } from '@chakra-ui/react';

export const WelcomePanel = () => {
  return (
    <Flex
      flexDir="column"
      justifyContent="center"
      alignItems="center"
      h="100%"
      textAlign="center"
      px={{ base: '1rem', md: '0' }}
    >
      <Text fontSize={{ base: '1.5rem', md: '2rem' }} fontWeight="medium">
        ¡Bienvenido!
      </Text>
      <Text fontSize={{ base: '1rem', md: '1.25rem' }} mt="0.5rem">
        Selecciona una opción del menú lateral para comenzar
      </Text>
    </Flex>
  );
};
