'use client';

import { Flex, Text, Button, Avatar } from '@chakra-ui/react';
import { MdLogout } from 'react-icons/md';
import { useUserStore } from '@/stores/useUserStore';

export const UserMenu = () => {
  const user = useUserStore((state) => state.user);
  const isHydrated = useUserStore((state) => state.isHydrated);
  const logout = useUserStore((state) => state.logout);

  const handleSignOut = () => {
    logout();
    window.location.href = '/iniciar-sesion';
  };

  if (!isHydrated || !user) return null;

  return (
    <Flex flexDir="column" gap="1rem">
      <Flex alignItems="center" gap="0.75rem">
        <Avatar w="2rem" h="2rem" size="sm" bg="black" color="white" name={user.name} />
        <Text fontWeight="bold">{user.name}</Text>
      </Flex>
      <Button
        bg="#f2f2f2"
        borderRadius="0.5rem"
        color="black"
        fontWeight="semibold"
        justifyContent="start"
        gap="0.25rem"
        px="0.75rem"
        onClick={handleSignOut}
        leftIcon={<MdLogout />}
        _hover={{ color: 'black', bg: '#e0dede' }}
      >
        Cerrar sesión
      </Button>
    </Flex>
  );
};
