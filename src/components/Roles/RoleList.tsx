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
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { RoleEdit } from './RoleEdit';
import { RoleDetail } from './RoleDetail';
import { Role } from '@/entities/role';

const dummyRoles: Role[] = [
  {
    id: 1,
    name: 'Administrador',
    description:
      'Tiene acceso total a todas las funcionalidades del sistema, incluyendo la gestión de usuarios, asignación de permisos, configuración de la plataforma, y control completo sobre el contenido y los datos. Puede ver, crear, editar y eliminar cualquier recurso disponible.',
    permissions: [1, 2, 3, 4],
  },
  {
    id: 2,
    name: 'Editor',
    description:
      'Puede crear, modificar y actualizar contenidos dentro de su área asignada. Tiene acceso limitado a funciones administrativas, pero no puede gestionar usuarios ni cambiar configuraciones generales del sistema.',
    permissions: [3],
  },
  {
    id: 3,
    name: 'Lector',
    description:
      'Cuenta únicamente con permisos de visualización. Puede acceder al contenido disponible públicamente o asignado a su rol, pero no puede realizar modificaciones ni acceder a funciones administrativas.',
    permissions: [4],
  },
];

export const RoleList = () => {
  const [roles, setRoles] = useState<Role[]>(dummyRoles);
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

  const handleSave = (updatedRole: Role) => {
    setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? { ...r, ...updatedRole } : r)));
    editModalDisclosure.onClose();
  };

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
            {roles.map((role) => (
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
        <Text fontSize="sm">Mostrando {roles.length} roles</Text>
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
