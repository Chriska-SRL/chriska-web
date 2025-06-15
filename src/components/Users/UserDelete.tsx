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
import { useDeleteUser } from '@/hooks/user';
import { useEffect, useState } from 'react';
import { User } from '@/entities/user';

type UserDeleteProps = {
  user: User;
  isUpdating: boolean;
  onDeleted?: () => void;
  setLocalUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserDelete = ({ user, isUpdating, onDeleted, setLocalUsers }: UserDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteUserProps, setDeleteUserProps] = useState<number>();
  const { data, error, isLoading } = useDeleteUser(deleteUserProps);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Usuario eliminado',
        description: `El usuario ${user.name} fue eliminado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalUsers((prev) => prev.filter((r) => r.id !== user.id));
      setConfirmOpen(false);
      setDeleteUserProps(undefined);
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
    setDeleteUserProps(user.id);
  };

  return (
    <>
      <IconButton
        aria-label="Eliminar usuario"
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
            <Text>¿Seguro que querés eliminar a {user.name}? Esta acción no se puede deshacer.</Text>
          </ModalBody>
          <ModalFooter display="flex" gap="0.5rem">
            <Button onClick={() => setConfirmOpen(false)} variant="outline">
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
