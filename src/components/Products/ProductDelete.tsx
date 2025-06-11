// ProductDelete.tsx

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
import { Product } from '@/entities/product';
import { useDeleteProduct } from '@/hooks/product';

type ProductDeleteProps = {
  product: Product;
  isUpdating: boolean;
  onDeleted?: () => void;
};

export const ProductDelete = ({ product, isUpdating, onDeleted }: ProductDeleteProps) => {
  const toast = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteProductProps, setDeleteProductProps] = useState<number>();
  const { data: deleted, error, isLoading } = useDeleteProduct(deleteProductProps!!);

  useEffect(() => {
    if (deleted) {
      toast({
        title: 'Producto eliminado',
        description: `El producto ${product.name} fue eliminado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setConfirmOpen(false);
      setDeleteProductProps(undefined);
      onDeleted?.();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }, [deleted]);

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
    setDeleteProductProps(product.id);
  };

  return (
    <>
      <IconButton
        aria-label="Eliminar producto"
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
            <Text>¿Seguro que querés eliminar “{product.name}”? Esta acción no se puede deshacer.</Text>
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
