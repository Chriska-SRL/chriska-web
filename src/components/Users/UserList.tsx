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
  Checkbox,
  useDisclosure,
  Box,
  Text,
  Spinner,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { UserEdit } from './UserEdit';
import { User } from '@/entities/user';
import { useGetUsers } from '@/hooks/requests/user';

export const UserList = () => {
  const { users, isLoading, error } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const modalDisclosure = useDisclosure();

  if (isLoading)
    return (
      <Box textAlign="center" py={4}>
        <Spinner size="lg" />
        <Text>Cargando usuarios...</Text>
      </Box>
    );

  if (error) return <Text color="red.500">Error: {error}</Text>;

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    modalDisclosure.onOpen();
  };

  const handleSave = (updatedUser: User) => {
    // Aquí deberías actualizar el usuario en el backend y volver a obtener la lista
  };

  return (
    <>
      <TableContainer
        overflowY="scroll"
        border="1px solid"
        borderRadius="0.5rem"
        borderColor="#f2f2f2"
        h="100%"
      >
        <Table variant="simple">
          <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
            <Tr>
              <Th textAlign="center">ID</Th>
              <Th textAlign="center">Usuario</Th>
              <Th textAlign="center">Nombre</Th>
              <Th textAlign="center">Rol</Th>
              <Th textAlign="center">Habilitado</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id} h="3rem">
                <Td textAlign="center">{user.id}</Td>
                <Td textAlign="center">{user.username}</Td>
                <Td textAlign="center">{user.name}</Td>
                <Td textAlign="center">{user.role}</Td>
                <Td textAlign="center">
                  <Checkbox isDisabled isChecked={user.is_enabled} bg="#f2f2f2" />
                </Td>
                <Td textAlign="center">
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
      <Box>
        <Text fontSize="sm">Mostrando {users.length} usuarios</Text>
      </Box>
      <UserEdit
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
        user={selectedUser}
        onSave={handleSave}
      />
    </>
  );
};
