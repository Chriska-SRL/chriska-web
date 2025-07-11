'use client';

import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Text,
  Spinner,
  Flex,
  VStack,
  useMediaQuery,
  useColorModeValue,
} from '@chakra-ui/react';
import { User } from '@/entities/user';
import { UserDetail } from './UserDetail';

type UserListProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
  error?: string;
};

export const UserList = ({ users, setUsers, isLoading, error }: UserListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

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
              {users.map((user) => (
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
                  <UserDetail user={user} setUsers={setUsers} />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {users.length} usuarios</Text>
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
                  <Th textAlign="center">Nombre de usuario</Th>
                  <Th textAlign="center">Nombre</Th>
                  <Th textAlign="center">Rol</Th>
                  <Th textAlign="center">Estado</Th>
                  <Th textAlign="center">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
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
                    <Td textAlign="center">
                      <UserDetail user={user} setUsers={setUsers} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {users.length} usuarios</Text>
          </Box>
        </>
      )}
    </>
  );
};
