'use client';

import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  VStack,
  Box,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FiEye, FiTag, FiFileText, FiPackage } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteShelve } from '@/hooks/shelve';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { Shelve } from '@/entities/shelve';
import { ShelveEdit } from './ShelveEdit';
import { useEffect, useCallback } from 'react';
import { Warehouse } from '@/entities/warehouse';

type ShelveDetailProps = {
  shelve: Shelve;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
  onShelveDeleted?: () => void;
};

export const ShelveDetail = ({
  shelve,
  setWarehouses,
  forceOpen,
  onModalClose,
  onShelveDeleted,
}: ShelveDetailProps) => {
  const canEditWarehouses = useUserStore((s) => s.hasPermission(Permission.EDIT_WAREHOUSES));
  const canDeleteWarehouses = useUserStore((s) => s.hasPermission(Permission.DELETE_WAREHOUSES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const handleClose = useCallback(() => {
    onClose();
    onModalClose?.();
  }, [onClose, onModalClose]);

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleShelveDeleted = useCallback(() => {
    if (onShelveDeleted) {
      onShelveDeleted();
    } else if (shelve.warehouse) {
      setWarehouses((prev) =>
        prev.map((warehouse) =>
          warehouse.id === shelve.warehouse.id
            ? {
                ...warehouse,
                shelves: warehouse.shelves.filter((s) => s.id !== shelve.id),
              }
            : warehouse,
        ),
      );
    }
    handleClose();
  }, [onShelveDeleted, setWarehouses, shelve.warehouse?.id, shelve.id, handleClose]);

  const detailField = (label: string, value: string | number | null | undefined, icon?: any) => (
    <Box w="100%">
      <HStack mb="0.5rem" spacing="0.5rem">
        {icon && <Icon as={icon} boxSize="1rem" color={iconColor} />}
        <Text color={labelColor} fontWeight="semibold">
          {label}
        </Text>
      </HStack>
      <Box
        px="1rem"
        py="0.5rem"
        bg={inputBg}
        border="1px solid"
        borderColor={inputBorder}
        borderRadius="md"
        minH="2.75rem"
        maxH="10rem"
        overflowY="auto"
        whiteSpace="pre-wrap"
        wordBreak="break-word"
        transition="all 0.2s"
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalles"
        icon={<FiEye />}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Detalle de la estantería
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Depósito', shelve.warehouse?.name, FiPackage)}
              {detailField('Nombre', shelve.name, FiTag)}
              {detailField('Descripción', shelve.description, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cerrar
              </Button>
              {canDeleteWarehouses && (
                <GenericDelete
                  item={{ id: shelve.id, name: shelve.name }}
                  useDeleteHook={useDeleteShelve}
                  setItems={() => {}}
                  onDeleted={handleShelveDeleted}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditWarehouses && (
                <Button
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    openEdit();
                    handleClose();
                  }}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                >
                  Editar
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ShelveEdit isOpen={isEditOpen} onClose={closeEdit} shelve={shelve} setWarehouses={setWarehouses} />
    </>
  );
};
