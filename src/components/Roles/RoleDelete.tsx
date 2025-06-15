'use client';

import {
  IconButton,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Role } from '@/entities/role';
import { useDeleteRole } from '@/hooks/roles';

type RoleDeleteProps = {
  role: Role;
  isUpdating: boolean;
  onDeleted?: () => void;
  setLocalRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export const RoleDelete = ({ role, isUpdating, onDeleted, setLocalRoles }: RoleDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteRoleProps, setDeleteRoleProps] = useState<number>();
  const { data, isLoading, error } = useDeleteRole(deleteRoleProps);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Rol eliminado',
        description: `El rol ${role.name} fue eliminado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalRoles((prev) => prev.filter((r) => r.id !== role.id));
      setConfirmOpen(false);
      setDeleteRoleProps(undefined);
      onDeleted?.();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error]);

  const handleConfirm = () => {
    setDeleteRoleProps(role.id);
  };

  return (
    <>
      <IconButton
        aria-label="Eliminar rol"
        icon={<FaTrash />}
        colorScheme="red"
        onClick={() => setConfirmOpen(true)}
        disabled={isUpdating || isLoading}
      />

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="1.25rem">¿Confirmar eliminación?</ModalHeader>
          <ModalBody>
            <Text>¿Seguro que querés eliminar el rol {role.name}? Esta acción no se puede deshacer.</Text>
          </ModalBody>
          <ModalFooter display="flex" gap="0.5rem">
            <Button onClick={() => setConfirmOpen(false)} variant="outline" disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleConfirm} colorScheme="red" isLoading={isLoading}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
