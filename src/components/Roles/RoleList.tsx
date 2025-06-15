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
  useDisclosure,
  Box,
  Text,
  Flex,
  Spinner,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RoleEdit } from './RoleEdit';
import { Role } from '@/entities/role';

type RoleListProps = {
  filterName?: string;
  roles: Role[];
  isLoading: boolean;
  error?: string;
  setLocalRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export const RoleList = ({ filterName, roles, isLoading, error, setLocalRoles }: RoleListProps) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const editModalDisclosure = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    editModalDisclosure.onOpen();
  };

  const filteredRoles = roles?.filter((role) =>
    filterName ? role.name.toLowerCase().includes(filterName.toLowerCase()) : true,
  );

  if (error) {
    return (
      <Box p="2rem" textAlign="center">
        <Text color="red.500">Error al cargar los roles: {error}</Text>
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

  if (!filteredRoles || filteredRoles.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron roles con esos parámetros de búsqueda.
        </Text>
        <Text fontSize="sm" color="gray.500">
          Inténtelo con otros parámetros.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {isMobile ? (
        <Flex direction="column" h="100%" maxH="32rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {filteredRoles.map((role) => (
                <Box
                  key={role.id}
                  px="1rem"
                  py="0.75rem"
                  border="1px solid #f2f2f2"
                  borderRadius="0.5rem"
                  bg="white"
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{role.name}</Text>
                  <Text fontSize="sm" color="gray.600" mt="0.25rem">
                    {role.description}
                  </Text>

                  <Flex position="absolute" top="0.5rem" right="0.5rem" gap="0.25rem">
                    <IconButton
                      aria-label="Editar rol"
                      icon={<FiEdit />}
                      onClick={() => handleEditClick(role)}
                      size="sm"
                      bg="transparent"
                      _hover={{ bg: 'gray.200' }}
                    />
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center" bg="white">
            <Text fontSize="sm">Mostrando {filteredRoles.length} roles</Text>
          </Box>
        </Flex>
      ) : (
        <>
          <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
            <Table variant="simple">
              <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
                <Tr>
                  <Th textAlign="center" w="20rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" maxW="45rem">
                    Descripción
                  </Th>
                  <Th px="0"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRoles.map((role) => (
                  <Tr key={role.id} h="3rem">
                    <Td textAlign="center">{role.name}</Td>
                    <Td textAlign="left">
                      <Box
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        title={role.description}
                        maxW="45rem"
                      >
                        {role.description}
                      </Box>
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Editar rol"
                        icon={<FiEdit />}
                        onClick={() => handleEditClick(role)}
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
            <Text fontSize="sm">Mostrando {filteredRoles.length} roles</Text>
          </Box>
        </>
      )}

      <RoleEdit
        isOpen={editModalDisclosure.isOpen}
        onClose={editModalDisclosure.onClose}
        role={selectedRole}
        setLocalRoles={setLocalRoles}
      />
    </>
  );
};
