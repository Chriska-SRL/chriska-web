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
};

export const GenericDelete = ({ item, isUpdating, onDeleted, setItems, useDeleteHook }: GenericDeleteProps) => {
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
        colorScheme="red"
        onClick={() => setConfirmOpen(true)}
        disabled={isUpdating || isLoading}
        leftIcon={<FaTrash />}
      >
        Eliminar
      </Button>

      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="1.25rem">¿Confirmar eliminación?</ModalHeader>
          <ModalBody>
            <Text>
              ¿Seguro que querés eliminar: {item.name}? <br />
              Esta acción no se puede deshacer.
            </Text>
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
