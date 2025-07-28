'use client';

import { Flex, Text, Button, Avatar, useColorModeValue } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { useUserStore } from '@/stores/useUserStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const UserMenu = () => {
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = () => {
    setIsLoading(true);

    setTimeout(() => {
      logout();
      router.push('/iniciar-sesion');
      setIsLoading(false);
    }, 2000);
  };

  const bgButton = useColorModeValue('gray.100', 'gray.700');
  const bgHover = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Flex flexDir="column" gap="1rem">
      <Flex alignItems="center" gap="0.75rem">
        <Avatar w="2rem" h="2rem" size="sm" bg="black" color="white" name={user?.name} />
        <Text fontWeight="bold" color={textColor}>
          {user?.name}
        </Text>
      </Flex>
      <Button
        bg={bgButton}
        borderRadius="0.5rem"
        color={textColor}
        fontWeight="semibold"
        justifyContent="start"
        gap="0.25rem"
        px="0.75rem"
        onClick={handleSignOut}
        leftIcon={<MdLogout />}
        _hover={{ bg: bgHover }}
        isLoading={isLoading}
        loadingText="Cerrando sesión..."
        disabled={isLoading}
      >
        Cerrar sesión
      </Button>
    </Flex>
  );
};
