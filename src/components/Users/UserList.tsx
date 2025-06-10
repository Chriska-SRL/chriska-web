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
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { UserEdit } from './UserEdit';
import { User } from '@/entities/user';
import { useGetUsers } from '@/hooks/user';

type UserListProps = {
  filterRoleId?: number;
  filterStateId?: string;
  filterName?: string;
};

export const UserList = ({ filterRoleId, filterStateId, filterName }: UserListProps) => {
  const { data: users, isLoading, error } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const filteredUsers = users?.filter((user) => {
    const matchRole = filterRoleId ? user.role.id === filterRoleId : true;
    const matchState = filterStateId ? (filterStateId === 'activo' ? user.isEnabled : !user.isEnabled) : true;
    const matchName = filterName ? user.name.toLowerCase().includes(filterName.toLowerCase()) : true;
    return matchRole && matchState && matchName;
  });

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

  if (!filteredUsers || filteredUsers.length === 0) {
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
              {filteredUsers.map((user) => (
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
            <Text fontSize="sm">Mostrando {filteredUsers.length} usuarios</Text>
          </Box>
        </Flex>
      ) : (
        <>
          <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
            <Table variant="simple">
              <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
                <Tr>
                  <Th textAlign="center" w="12rem">
                    Usuario
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" w="10rem">
                    Rol
                  </Th>
                  <Th textAlign="center" w="8rem">
                    Estado
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
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
                    <Td textAlign="center" pr="2rem">
                      <IconButton
                        aria-label="Editar usuario"
                        icon={<FiEdit />}
                        onClick={() => handleEditClick(user)}
                        variant="ghost"
                        size="lg"
                        _hover={{ bg: 'blackAlpha.100' }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {filteredUsers.length} usuarios</Text>
          </Box>
        </>
      )}
      <UserEdit isOpen={isOpen} onClose={onClose} user={selectedUser} />
    </>
  );
};
