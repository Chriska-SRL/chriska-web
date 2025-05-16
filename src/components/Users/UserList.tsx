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
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { UserEdit } from './UserEdit';
import { User } from '@/entities/user';

const dummyUsers: User[] = [
  {
    id: 1,
    username: 'ana@example.com',
    name: 'Ana García',
    password: '********',
    is_enabled: true,
    role: 'admin',
  },
  {
    id: 2,
    username: 'carlos@example.com',
    name: 'Carlos Pérez',
    password: '********',
    is_enabled: false,
    role: 'editor',
  },
  {
    id: 3,
    username: 'lucia@example.com',
    name: 'Lucía Fernández',
    password: '********',
    is_enabled: true,
    role: 'viewer',
  },
];

const roles = [
  { id: 'admin', label: 'Administrador' },
  { id: 'editor', label: 'Editor' },
  { id: 'viewer', label: 'Lector' },
];

export const UserList = () => {
  const [users, setUsers] = useState<User[]>(dummyUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const modalDisclosure = useDisclosure();

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    modalDisclosure.onOpen();
  };

  const handleSave = (updatedUser: User) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u)));
  };

  return (
    <>
      <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
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
            {dummyUsers.map((user) => (
              <Tr key={user.id} h="3rem">
                <Td textAlign="center">{user.id}</Td>
                <Td textAlign="center">{user.username}</Td>
                <Td textAlign="center">{user.name}</Td>
                <Td textAlign="center">{roles.find((role) => role.id === user.role)?.label}</Td>
                <Td textAlign="center">
                  <Checkbox isDisabled defaultChecked={user.is_enabled} bg="#f2f2f2" />
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
