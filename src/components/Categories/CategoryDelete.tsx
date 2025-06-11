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
import { Category } from '@/entities/category';
import { useDeleteCategory } from '@/hooks/category';

type CategoryDeleteProps = {
  category: Category;
  isUpdating: boolean;
  onDeleted?: () => void;
};

export const CategoryDelete = ({ category, isUpdating, onDeleted }: CategoryDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteCategoryProps, setDeleteCategoryProps] = useState<number>();
  const { data: categoryDeleted, error, isLoading } = useDeleteCategory(deleteCategoryProps!!);

  useEffect(() => {
    if (categoryDeleted) {
      toast({
        title: 'Categoría eliminada',
        description: `La categoría ${category.name} fue eliminada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setConfirmOpen(false);
      setDeleteCategoryProps(undefined);
      onDeleted?.();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }, [categoryDeleted]);

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
    setDeleteCategoryProps(category.id);
  };

  return (
    <>
      <IconButton
        aria-label="Eliminar categoría"
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
            <Text>¿Seguro que querés eliminar la categoría "{category.name}"? Esta acción no se puede deshacer.</Text>
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
