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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    setIsLoggingOut(true);

    try {
      if (typeof window !== 'undefined') {
        // Limpiar solo la cookie para que el middleware redirija, pero mantener el estado de Zustand
        // para que la UI se vea bien hasta la redirección
        document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Lax';

        // Limpiar sessionStorage
        sessionStorage.clear();

        // Hacer la redirección
        window.location.replace('/iniciar-sesion');
      } else {
        // Fallback para SSR
        logout();
        router.push('/iniciar-sesion');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // En caso de error, hacer limpieza completa y forzar redirección
      logout();
      if (typeof window !== 'undefined') {
        window.location.replace('/iniciar-sesion');
      } else {
        router.push('/iniciar-sesion');
      }
    }
  };

  const bgButton = useColorModeValue('#f2f2f2', 'gray.700');
  const bgHover = useColorModeValue('#e0dede', 'gray.600');
  const textColor = useColorModeValue('black', 'white');

  return (
    <Flex flexDir="column" gap="1rem">
      <Flex alignItems="center" gap="0.75rem" opacity={isLoggingOut ? 0.7 : 1}>
        <Avatar w="2rem" h="2rem" size="sm" bg="black" color="white" name={user?.name} />
        <Text fontWeight="bold" color={textColor}>
          {isLoggingOut ? 'Cerrando sesión...' : user?.name}
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
        loadingText="Redirigiendo..."
        disabled={isLoading}
      >
        Cerrar sesión
      </Button>
    </Flex>
  );
};
