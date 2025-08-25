'use client';

import {
  Button,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

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
  const cancelRef = useRef(null);
  
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

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

      <AlertDialog isOpen={confirmOpen} leastDestructiveRef={cancelRef} onClose={() => setConfirmOpen(false)} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader 
            fontSize="1.125rem" 
            fontWeight="semibold" 
            pb="0.75rem"
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Eliminar elemento
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pt="1rem" pb="1.5rem">
            ¿Estás seguro de que deseas eliminar "{item.name}"?
            <br />
            <Text mt="0.5rem" fontSize="sm" color="gray.500">
              Esta acción no se puede deshacer.
            </Text>
          </AlertDialogBody>

          <AlertDialogFooter 
            pt="1rem" 
            justifyContent="flex-end" 
            gap="0.5rem"
            borderTop="1px solid"
            borderColor={inputBorder}
          >
            <Button ref={cancelRef} onClick={() => setConfirmOpen(false)} variant="ghost" size="sm" disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirm}
              isLoading={isLoading}
              loadingText="Eliminando..."
              variant="outline"
              size="sm"
            >
              Sí, eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
