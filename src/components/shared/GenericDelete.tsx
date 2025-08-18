'use client';

import {
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

type GenericDeleteProps = {
  item: { id: number; name: string };
  isUpdating?: boolean;
  onDeleted?: () => void;
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  useDeleteHook: (id?: number) => {
    success?: boolean;
    data?: any;
    isLoading: boolean;
    error?: string;
  };
  size?: 'sm' | 'md';
  variant?: 'solid' | 'outline';
};

export const GenericDelete = ({
  item,
  isUpdating,
  onDeleted,
  setItems,
  useDeleteHook,
  size = 'sm',
  variant = 'outline',
}: GenericDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const { success, data, isLoading, error } = useDeleteHook(deleteId);

  useEffect(() => {
    if (success || data) {
      toast({
        title: 'Elemento eliminado',
        description: `Se ha eliminado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setItems((prev) => prev.filter((r) => r.id !== item.id));
      setConfirmOpen(false);
      setDeleteId(undefined);
      onDeleted?.();
    }
  }, [success, data]);

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
    setDeleteId(item.id);
  };

  return (
    <>
      <Button
        leftIcon={<FaTrash />}
        onClick={() => setConfirmOpen(true)}
        colorScheme="red"
        variant={variant}
        size={size}
        disabled={isUpdating || isLoading}
      >
        Eliminar
      </Button>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar eliminación</ModalHeader>

          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar "{item.name}"?</Text>
            <Text mt="0.5rem" fontSize="sm" color="gray.500">
              Esta acción no se puede deshacer.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setConfirmOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleConfirm} isLoading={isLoading} loadingText="Eliminando...">
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
