'use client';

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
  Box,
  Text,
  Spinner,
  Flex,
  useDisclosure,
  VStack,
  useMediaQuery,
  Divider,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { UserEdit } from './UserEdit';
import { User } from '@/entities/user';
import { useGetUsers } from '@/hooks/user';

export const UserList = () => {
  const { data: users, isLoading, error } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { onOpen, isOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los usuarios: {error}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!users || users.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No hay usuarios registrados.
        </Text>
        <Text fontSize="sm" color="gray.500">
          Agregue un usuario para que aparezca en la lista.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {isMobile ? (
        <Flex direction="column" h="25rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {users?.map((user) => (
                <Box
                  key={user.id}
                  px="1rem"
                  py="0.5rem"
                  border="1px solid #f2f2f2"
                  borderRadius="0.5rem"
                  bg="white"
                  boxShadow="sm"
                  position="relative"
                >
                  <Box
                    position="absolute"
                    top="0.75rem"
                    right="0.75rem"
                    bg={user.isEnabled ? 'green.100' : 'red.100'}
                    color={user.isEnabled ? 'green.800' : 'red.800'}
                    px="0.75rem"
                    py="0.25rem"
                    borderRadius="full"
                    fontSize="0.75rem"
                  >
                    {user.isEnabled ? 'Activo' : 'Inactivo'}
                  </Box>

                  <Text fontWeight="bold">{user.name}</Text>
                  <Text fontSize="sm" color="gray.600" mt="0.25rem">
                    Usuario: {user.username}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mt="0.25rem">
                    Rol: {user.role.name}
                  </Text>
                  <IconButton
                    aria-label="Editar usuario"
                    icon={<FiEdit />}
                    onClick={() => handleEditClick(user)}
                    size="md"
                    position="absolute"
                    bottom="0.25rem"
                    right="0.25rem"
                    bg="transparent"
                    _hover={{ bg: 'gray.200' }}
                  />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center" bg="white">
            <Text fontSize="sm">Mostrando {users?.length} usuarios</Text>
          </Box>
        </Flex>
      ) : (
        <>
          <TableContainer overflowY="auto" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
            <Table variant="simple">
              <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
                <Tr>
                  <Th textAlign="center">Nombre de usuario</Th>
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">Rol</Th>
                  <Th textAlign="center">Estado</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users?.map((user) => (
                  <Tr key={user.id} h="3rem">
                    <Td textAlign="center">{user.username}</Td>
                    <Td textAlign="center">{user.name}</Td>
                    <Td textAlign="center">{user.role.name}</Td>
                    <Td textAlign="center">
                      <Box
                        bg={user.isEnabled ? 'green.100' : 'red.100'}
                        color={user.isEnabled ? 'green.800' : 'red.800'}
                        px="0.75rem"
                        py="0.25rem"
                        borderRadius="full"
                        fontSize="0.75rem"
                        display="inline-block"
                      >
                        {user.isEnabled ? 'Activo' : 'Inactivo'}
                      </Box>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Editar usuario"
                        icon={<FiEdit />}
                        onClick={() => handleEditClick(user)}
                        variant="ghost"
                        size="md"
                        _hover={{ bg: 'blackAlpha.100' }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {users?.length} usuarios</Text>
          </Box>
        </>
      )}
      <UserEdit isOpen={isOpen} onClose={onClose} user={selectedUser} />
    </>
  );
};
