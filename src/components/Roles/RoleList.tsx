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
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { RoleEdit } from './RoleEdit';
import { Role } from '@/entities/role';
import { useUserStore } from '@/stores/useUserStore';
import { PermissionId } from '@/entities/permissions/permissionId';
import { RoleDetail } from './RoleDetail';

type RoleListProps = {
  roles: Role[];
  isLoading: boolean;
  error?: string;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export const RoleList = ({ roles, isLoading, error, setRoles }: RoleListProps) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const editModalDisclosure = useDisclosure();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const borderColor = useColorModeValue('#f2f2f2', 'gray.700');
  const tableHeadBg = useColorModeValue('#f2f2f2', 'gray.700');
  const borderBottomColor = useColorModeValue('#f2f2f2', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    editModalDisclosure.onOpen();
  };

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

  if (!roles || roles.length === 0) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" h="100%" textAlign="center" p="2rem">
        <Text fontSize="lg" fontWeight="semibold" mb="0.5rem">
          No se encontraron roles con esos parámetros de búsqueda.
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
        <Flex direction="column" h="100%" maxH="32rem" justifyContent="space-between">
          <Box overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {roles.map((role) => (
                <Box
                  key={role.id}
                  px="1rem"
                  py="0.75rem"
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="0.5rem"
                  bg={cardBg}
                  boxShadow="sm"
                  position="relative"
                >
                  <Text fontWeight="bold">{role.name}</Text>
                  <Text fontSize="sm" color={textColor} mt="0.25rem">
                    {role.description}
                  </Text>

                  <Flex position="absolute" top="0.5rem" right="0.5rem" gap="0.25rem">
                    <RoleDetail role={role} setRoles={setRoles} />
                  </Flex>
                </Box>
              ))}
            </VStack>
          </Box>
          <Box py="1rem" textAlign="center">
            <Text fontSize="sm">Mostrando {roles.length} roles</Text>
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
                  <Th textAlign="center" w="20rem">
                    Nombre
                  </Th>
                  <Th textAlign="center" maxW="30rem">
                    Descripción
                  </Th>
                  <Th px="0"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {roles.map((role) => (
                  <Tr key={role.id} h="3rem" borderBottom="1px solid" borderBottomColor={borderBottomColor}>
                    <Td textAlign="center">{role.name}</Td>
                    <Td textAlign="center" maxW="30rem">
                      <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={role.description}>
                        {role.description}
                      </Box>
                    </Td>
                    <Td textAlign="center">
                      <RoleDetail role={role} setRoles={setRoles} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          <Box mt="0.5rem">
            <Text fontSize="sm">Mostrando {roles.length} roles</Text>
          </Box>
        </>
      )}

      <RoleEdit
        isOpen={editModalDisclosure.isOpen}
        onClose={editModalDisclosure.onClose}
        role={selectedRole}
        setRoles={setRoles}
      />
    </>
  );
};
