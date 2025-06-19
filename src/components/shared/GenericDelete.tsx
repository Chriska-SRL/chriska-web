'use client';

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { useRef } from 'react';

interface GenericDeleteProps<T> {
  item: T | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
  name: string;
  getId?: (item: T) => number;
}

export function GenericDelete<T>({
  item,
  isOpen,
  onClose,
  onDelete,
  name,
  getId = (item) => (item as any).id,
}: GenericDeleteProps<T>) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDelete = () => {
    if (item) {
      const id = getId(item);
      onDelete(id);
      onClose();
    }
  };

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>¿Eliminar {name}?</AlertDialogHeader>
          <AlertDialogBody>Esta acción no se puede deshacer. ¿Querés continuar?</AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleDelete} ml={3}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
