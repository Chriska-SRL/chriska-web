'use client';

import {
  Box,
  Checkbox,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
  Button,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { IoMdInformationCircleOutline } from 'react-icons/io';

type Role = {
  id: number;
  name: string;
  permissions: string[];
};

const dummyRoles: Role[] = [
  { id: 1, name: 'Administrador', permissions: ['crear', 'editar', 'eliminar'] },
  { id: 2, name: 'Editor', permissions: ['editar'] },
  { id: 3, name: 'Lector', permissions: ['ver'] },
];

type FormProps = {
  role: Role;
  onSave: (updatedRole: Role) => void;
};

const FormikEditRole = ({ role, onSave }: FormProps) => {
  const [name, setName] = useState(role.name);
  const [permissions, setPermissions] = useState<string[]>(role.permissions);

  const allPermissions = ['crear', 'editar', 'eliminar', 'ver', 'publicar', 'despublicar'];

  const togglePermission = (perm: string) => {
    setPermissions((prev) => (prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]));
  };

  const handleSubmit = () => {
    onSave({ ...role, name, permissions });
  };

  return (
    <VStack spacing="1rem" align="stretch">
      <FormControl>
        <FormLabel>Nombre del rol</FormLabel>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>

      <FormControl>
        <FormLabel>Permisos</FormLabel>
        <Flex wrap="wrap" gap="0.5rem">
          {allPermissions.map((perm) => (
            <Checkbox key={perm} isChecked={permissions.includes(perm)} onChange={() => togglePermission(perm)}>
              {perm}
            </Checkbox>
          ))}
        </Flex>
      </FormControl>

      <Button onClick={handleSubmit} colorScheme="blue" w="full">
        Guardar
      </Button>
    </VStack>
  );
};

export const RoleList = () => {
  const [roles, setRoles] = useState<Role[]>(dummyRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const modalDisclosure = useDisclosure();

  const handleEditClick = (role: Role) => {
    setSelectedRole(role);
    modalDisclosure.onOpen();
  };

  const handleSave = (updatedRole: Role) => {
    setRoles((prev) => prev.map((r) => (r.id === updatedRole.id ? { ...r, ...updatedRole } : r)));
    modalDisclosure.onClose();
  };

  return (
    <>
      <Flex wrap="wrap" gap="1rem" h="100%" alignContent="flex-start">
        {roles.map((role) => (
          <Flex
            key={role.id}
            w="calc(50% - 0.5rem)"
            alignSelf="flex-start"
            border="1px solid #f2f2f2"
            borderRadius="0.5rem"
            p="1rem"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Text fontWeight="bold">ID: {role.id}</Text>
              <Text>{role.name}</Text>
            </Box>
            <Flex gap="0.5rem">
              <IconButton
                aria-label="Ver detalle"
                icon={<IoMdInformationCircleOutline />}
                onClick={() => handleEditClick(role)}
                variant="ghost"
                size="lg"
                _hover={{ bg: 'blackAlpha.100' }}
              />
              <IconButton
                aria-label="Editar rol"
                icon={<FiEdit />}
                onClick={() => handleEditClick(role)}
                variant="ghost"
                size="lg"
                _hover={{ bg: 'blackAlpha.100' }}
              />
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Box mt="0.5rem">
        <Text fontSize="sm">Mostrando {roles.length} roles</Text>
      </Box>

      <Modal isOpen={modalDisclosure.isOpen} onClose={modalDisclosure.onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar rol</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="1.5rem">
            {selectedRole && <FormikEditRole role={selectedRole} onSave={handleSave} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
