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

export const RoleList = () => {
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

  return (
    <>
      <TableContainer overflowY="scroll" border="1px solid" borderRadius="0.5rem" borderColor="#f2f2f2" h="100%">
        <Table variant="simple">
          <Thead position="sticky" top="0" bg="#f2f2f2" zIndex="1">
            <Tr>
              <Th textAlign="center" w="6rem">
                ID
              </Th>
              <Th textAlign="center" w="10rem">
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
            {roles?.map((role) => (
              <Tr key={role.id} h="3rem">
                <Td textAlign="center" w="6rem">
                  {role.id}
                </Td>
                <Td textAlign="center" w="10rem">
                  {role.name}
                </Td>
                <Td textAlign="left" maxW="20rem">
                  <Box whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis" title={role.description} w="100%">
                    {role.description}
                  </Box>
                </Td>

                <Td textAlign="center" w="4rem" pl="2rem" pr="0.75rem">
                  <IconButton
                    aria-label="Ver detalle"
                    icon={<IoMdInformationCircleOutline />}
                    onClick={() => handleDetailClick(role)}
                    variant="ghost"
                    size="lg"
                    _hover={{ bg: 'blackAlpha.100' }}
                  />
                </Td>
                <Td textAlign="center" w="4rem" pl="0.75rem" pr="2rem">
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
        <Text fontSize="sm">Mostrando {roles?.length} roles</Text>
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
