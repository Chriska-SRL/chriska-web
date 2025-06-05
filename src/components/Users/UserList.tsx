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
  Flex,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { UserEdit } from './UserEdit';
import { User } from '@/entities/user';
import { useGetUsers } from '@/hooks/user';

const roles = [
  { id: 'admin', label: 'Administrador' },
  { id: 'editor', label: 'Editor' },
  { id: 'viewer', label: 'Lector' },
];

export const UserList = () => {
  const { data: users, isLoading, error } = useGetUsers();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const modalDisclosure = useDisclosure();

  useEffect(() => {
    console.log('Usuarios desde hook:', users);
  }, [users]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    modalDisclosure.onOpen();
  };

  const handleSave = (updatedUser: User) => {
    // Esta parte es opcional. Si querés mantener los datos frescos desde el backend,
    // podrías refetchear en lugar de actualizar el estado local.
    // En este ejemplo, asumimos que vas a mutar localmente por ahora.
  };

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los usuarios: {error}</Text>
      </Box>
    );
  }

  return (
    <>
      {isLoading ? (
        <Flex justifyContent="center" alignItems="center" h="100%">
          <Spinner size="xl" />
        </Flex>
      ) : (
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
                {isLoading ? (
                  <></>
                ) : (
                  <>
                    {users?.map((user) => (
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
                  </>
                )}
              </Tbody>
            </Table>
          </TableContainer>

          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {users?.length} usuarios</Text>
          </Box>
        </>
      )}

      <UserEdit
        isOpen={modalDisclosure.isOpen}
        onClose={modalDisclosure.onClose}
        user={selectedUser}
        onSave={handleSave}
      />
    </>
  );
};
