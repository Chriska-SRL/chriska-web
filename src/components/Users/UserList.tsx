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
  useColorModeValue,
} from '@chakra-ui/react';
import { FiEdit } from 'react-icons/fi';
import { useState } from 'react';
import { UserEdit } from './UserEdit';
import { User } from '@/entities/user';

type UserListProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  filterRoleId?: number;
  filterStateId?: string;
  filterName?: string;
  isLoading: boolean;
  error?: string;
};

export const UserList = ({
  users,
  setUsers,
  filterRoleId,
  filterStateId,
  filterName,
  isLoading,
  error,
}: UserListProps) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

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
          No se encontraron usuarios con esos parámetros de búsqueda.
        </Text>
        <Text fontSize="sm" color={textColor}>
          Inténtelo con otros parámetros.
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
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
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
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    Usuario: {user.username}
                  </Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
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
                    _hover={{ bg: hoverBgIcon }}
                  />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center" bg={cardBg}>
            <Text fontSize="sm">Mostrando {filteredUsers.length} usuarios</Text>
          </Box>
        </Flex>
      ) : (
        <>
          <TableContainer
            overflowY="scroll"
            border="1px solid"
            borderRadius="0.5rem"
            borderColor={borderColor}
            h="100%"
          >
            <Table variant="unstyled">
              <Thead position="sticky" top="0" bg={tableHeadBg} zIndex="1">
                <Tr>
                  <Th textAlign="center" w="12rem">
                    Nombre de usuario
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
                  <Tr key={user.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{user.username}</Td>
                    <Td textAlign="center">{user.name}</Td>
                    <Td textAlign="center">{user.role.name}</Td>
                    <Td textAlign="center">
                      <Box
                        bg={user.isEnabled ? 'green.300' : 'red.300'}
                        color={user.isEnabled ? 'green.900' : 'red.900'}
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
                        _hover={{ bg: hoverBgIcon }}
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
      <UserEdit isOpen={isOpen} onClose={onClose} user={selectedUser} setLocalUsers={setUsers} />
    </>
  );
};
