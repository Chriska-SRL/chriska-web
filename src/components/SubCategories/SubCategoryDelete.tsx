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
import { SubCategory } from '@/entities/subcategory';
import { useDeleteSubCategory } from '@/hooks/subcategory';

type SubCategoryDeleteProps = {
  subcategory: SubCategory;
  isUpdating: boolean;
  onDeleted?: () => void;
};

export const SubCategoryDelete = ({ subcategory, isUpdating, onDeleted }: SubCategoryDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteSubCategoryProps, setDeleteSubCategoryProps] = useState<number>();
  const { data: subcategoryDeleted, error, isLoading } = useDeleteSubCategory(deleteSubCategoryProps!!);

  useEffect(() => {
    if (subcategoryDeleted) {
      toast({
        title: 'Subcategoría eliminada',
        description: `La subcategoría ${subcategory.name} fue eliminada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setConfirmOpen(false);
      setDeleteSubCategoryProps(undefined);
      onDeleted?.();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }, [subcategoryDeleted]);

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
    setDeleteSubCategoryProps(subcategory.id);
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
            <Text>
              ¿Seguro que querés eliminar la subcategoría "{subcategory.name}"? Esta acción no se puede deshacer.
            </Text>
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
