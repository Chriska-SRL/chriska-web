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

type Props = {
  user: User;
  size?: 'icon' | 'full';
  onDeleted?: () => void;
};

export const UserDelete = ({ user, size = 'icon', onDeleted }: Props) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteUserProps, setDeleteUserProps] = useState<number>();
  const { data: userDeleted, error, isLoading } = useDeleteUser(deleteUserProps!!);

  useEffect(() => {
    if (userDeleted) {
      toast({
        title: 'Usuario eliminado',
        description: `El usuario ${user.name} fue eliminado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setConfirmOpen(false);
      setDeleteUserProps(undefined);
      onDeleted?.();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }, [userDeleted]);

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
      {size === 'icon' ? (
        <IconButton
          aria-label="Eliminar usuario"
          icon={<FaTrash />}
          colorScheme="red"
          onClick={() => setConfirmOpen(true)}
          isLoading={isLoading}
        />
      ) : (
        <Button leftIcon={<FaTrash />} colorScheme="red" onClick={() => setConfirmOpen(true)} isLoading={isLoading}>
          Eliminar
        </Button>
      )}

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
