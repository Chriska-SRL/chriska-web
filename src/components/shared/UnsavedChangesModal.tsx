'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  Text,
  HStack,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiAlertCircle } from 'react-icons/fi';

type UnsavedChangesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
};

export const UnsavedChangesModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = '¿Descartar cambios?',
  message = 'Hay cambios sin guardar. ¿Estás seguro de que deseas salir?',
  confirmText = 'Descartar',
  cancelText = 'Continuar editando',
}: UnsavedChangesModalProps) => {
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="1.25rem" borderBottom="1px solid" borderColor={inputBorder} pb="0.75rem">
          <Text>{title}</Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody py="1.5rem">
          <Text fontSize="0.95rem" color="gray.600" _dark={{ color: 'gray.400' }}>
            {message}
          </Text>
        </ModalBody>

        <ModalFooter borderTop="1px solid" borderColor={inputBorder} pt="0.75rem">
          <HStack spacing="0.5rem">
            <Button variant="ghost" onClick={onClose} size="sm">
              {cancelText}
            </Button>
            <Button colorScheme="red" variant="outline" onClick={onConfirm} size="sm">
              {confirmText}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
