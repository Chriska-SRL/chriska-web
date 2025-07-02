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
import { Shelve } from '@/entities/shelve';
import { useDeleteShelve } from '@/hooks/shelve';
import { Warehouse } from '@/entities/warehouse';

type ShelveDeleteProps = {
  shelve: Shelve;
  isUpdating: boolean;
  onDeleted?: () => void;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const ShelveDelete = ({ shelve, isUpdating, onDeleted, setWarehouses }: ShelveDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteShelveProps, setDeleteShelveProps] = useState<number>();
  const { data: shelveDeleted, error, isLoading } = useDeleteShelve(deleteShelveProps!!);

  useEffect(() => {
    if (shelveDeleted) {
      toast({
        title: 'Estantería eliminada',
        description: `La estantería fue eliminada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setWarehouses((prev) =>
        prev.map((warehouse) =>
          warehouse.id === shelve.warehouse.id
            ? {
                ...warehouse,
                shelves: warehouse.shelves.filter((shel) => shel.id !== shelve.id),
              }
            : warehouse,
        ),
      );
      setConfirmOpen(false);
      setDeleteShelveProps(undefined);
      onDeleted?.();
    }
  }, [shelveDeleted]);

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
    setDeleteShelveProps(shelve.id);
  };

  return (
    <>
      <IconButton
        aria-label="Eliminar subcategoría"
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
            <Text>¿Seguro que querés eliminar la subcategoría "{shelve.name}"? Esta acción no se puede deshacer.</Text>
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
