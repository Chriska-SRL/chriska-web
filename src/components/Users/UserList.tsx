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
  HStack,
  Badge,
  Icon,
} from '@chakra-ui/react';
import { User } from '@/entities/user';
import { UserDetail } from './UserDetail';
import { Pagination } from '../Pagination';
import { FiUser, FiShield, FiCheckCircle } from 'react-icons/fi';

type UserListProps = {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  isLoading: boolean;
  error?: string;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export const UserList = ({
  users,
  setUsers,
  isLoading,
  error,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: UserListProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const emptyTextColor = useColorModeValue('gray.500', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const hasNextPage = users.length === pageSize;

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error: {error}</Text>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!users?.length) {
    return (
      <Flex direction="column" align="center" justify="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold">
          No se encontraron usuarios.
        </Text>
        <Text fontSize="sm" color={emptyTextColor}>
          Intenta con otros parámetros.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {isMobile ? (
        <>
          <Box overflowY="auto" h="calc(100% - 3.5rem)">
            <VStack spacing="1rem" align="stretch">
              {users.map((user) => (
                <Box
                  key={user.id}
                  p="1rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <HStack spacing="0.75rem" mb="0.5rem" pr="2.5rem">
                    <VStack align="start" spacing="0.125rem" flex="1" minW="0">
                      <Text fontWeight="bold" fontSize="md" noOfLines={2} lineHeight="1.3" wordBreak="break-word">
                        {user.name}
                      </Text>
                    </VStack>
                  </HStack>

                  <VStack spacing="0.25rem" align="stretch" fontSize="sm">
                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiUser} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Usuario</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {user.username}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiShield} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Rol</Text>
                      </HStack>
                      <Text fontWeight="semibold" noOfLines={1} maxW="10rem">
                        {user.role.name}
                      </Text>
                    </HStack>

                    <HStack justify="space-between">
                      <HStack spacing="0.5rem">
                        <Icon as={FiCheckCircle} boxSize="0.875rem" color={iconColor} />
                        <Text color={textColor}>Estado</Text>
                      </HStack>
                      <Badge
                        colorScheme={user.isEnabled ? 'green' : 'red'}
                        fontSize="0.75rem"
                        p="0.125rem 0.5rem"
                        borderRadius="0.375rem"
                      >
                        {user.isEnabled ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </HStack>
                  </VStack>

                  <Box position="absolute" top="0rem" right="0.25rem">
                    <UserDetail user={user} setUsers={setUsers} />
                  </Box>
                </Box>
              ))}
            </VStack>
          </Box>
          <Flex h="3.5rem" alignItems="center" justifyContent="space-between">
            <Text fontSize="sm" fontWeight="medium">
              Mostrando {users.length} usuario{users.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          </Flex>
        </>
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
                    Usuario
                  </Th>
                  <Th textAlign="center" w="15rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" w="12rem">
                    Rol
                  </Th>
                  <Th textAlign="center" w="8rem">
                    Estado
                  </Th>
                  <Th w="4rem" pr="2rem"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{user.username}</Td>
                    <Td textAlign="center">{user.name}</Td>
                    <Td textAlign="center">{user.role.name}</Td>
                    <Td textAlign="center">
                      <Badge
                        colorScheme={user.isEnabled ? 'green' : 'red'}
                        fontSize="0.75rem"
                        p="0.25rem 0.75rem"
                        borderRadius="0.375rem"
                      >
                        {user.isEnabled ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </Td>
                    <Td textAlign="center" pr="2rem">
                      <UserDetail user={user} setUsers={setUsers} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Flex mt="0.5rem" justifyContent="space-between" alignItems="center">
            <Text fontSize="sm">
              Mostrando {users.length} usuario{users.length !== 1 ? 's' : ''}
            </Text>
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              hasNextPage={hasNextPage}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
              isLoading={isLoading}
            />
          </Flex>
        </>
      )}
    </>
  );
};
