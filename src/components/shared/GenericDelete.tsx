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
    data?: any;
    isLoading: boolean;
    error?: string;
  };
};

export const GenericDelete = ({ item, isUpdating, onDeleted, setItems, useDeleteHook }: GenericDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const { data, isLoading, error } = useDeleteHook(deleteId);

  useEffect(() => {
    if (data) {
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
    setDeleteId(item.id);
  };

  return (
    <>
      <IconButton
        aria-label="Eliminar"
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
