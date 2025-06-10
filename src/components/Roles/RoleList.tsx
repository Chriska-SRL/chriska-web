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
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { RoleEdit } from './RoleEdit';
import { RoleDetail } from './RoleDetail';
import { Role } from '@/entities/role';
import { useGetRoles } from '@/hooks/roles';

type RoleListProps = {
  filterName?: string;
};

export const RoleList = ({ filterName }: RoleListProps) => {
  const { data: roles, isLoading, error } = useGetRoles();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const editModalDisclosure = useDisclosure();
  const detailModalDisclosure = useDisclosure();

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    editModalDisclosure.onOpen();
  };

  const handleDetailClick = (role: Role) => {
    setSelectedRole(role);
    detailModalDisclosure.onOpen();
  };

  const handleSave = (updatedRole: Role) => {};

  const filteredRoles = roles?.filter((role) => {
    return filterName ? role.name.toLowerCase().includes(filterName.toLowerCase()) : true;
  });

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
          No hay roles registrados.
        </Text>
        <Text fontSize="sm" color="gray.500">
          Agregue un rol para que aparezca en la lista.
        </Text>
      </Flex>
    );
  }

  return (
    <>
      <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
        <Table variant="simple">
          <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
            <Tr>
              <Th textAlign="center" w="20rem">
                Nombre
              </Th>
              <Th textAlign="center" maxW="20rem">
                Descripción
              </Th>
              <Th w="4rem" px="0"></Th>
              <Th w="4rem" pl="1rem" pr="2rem"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredRoles.map((role) => (
              <Tr key={role.id} h="3rem">
                <Td textAlign="center" w="20%">
                  {role.name}
                </Td>
                <Td textAlign="left" maxW="20rem">
                  <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={role.description}>
                    {role.description}
                  </Box>
                </Td>
                <Td textAlign="center">
                  <IconButton
                    aria-label="Ver detalle"
                    icon={<IoMdInformationCircleOutline />}
                    onClick={() => handleDetailClick(role)}
                    variant="ghost"
                    size="lg"
                    _hover={{ bg: 'blackAlpha.100' }}
                  />
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

      <RoleEdit
        isOpen={editModalDisclosure.isOpen}
        onClose={editModalDisclosure.onClose}
        role={selectedRole}
        onSave={handleSave}
      />
      <RoleDetail isOpen={detailModalDisclosure.isOpen} onClose={detailModalDisclosure.onClose} role={selectedRole} />
    </>
  );
};
