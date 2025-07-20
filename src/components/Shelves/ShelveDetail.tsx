'use client';

import {
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  Box,
  Text,
  Button,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { FiEye } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteShelve } from '@/hooks/shelve';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { Shelve } from '@/entities/shelve';
import { ShelveEdit } from './ShelveEdit';
import { useEffect } from 'react';
import { Warehouse } from '@/entities/warehouse';

type ShelveDetailProps = {
  shelve: Shelve;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const ShelveDetail = ({ shelve, setWarehouses, forceOpen, onModalClose }: ShelveDetailProps) => {
  const canEditWarehouses = useUserStore((s) => s.hasPermission(Permission.EDIT_WAREHOUSES));
  const canDeleteWarehouses = useUserStore((s) => s.hasPermission(Permission.DELETE_WAREHOUSES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const handleClose = () => {
    onClose();
    onModalClose?.();
  };

  const detailField = (label: string, value: string | number | null | undefined) => (
    <Box w="100%">
      <Text color={labelColor} mb="0.5rem">
        {label}
      </Text>
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
      >
        {value ?? '—'}
      </Box>
    </Box>
  );

  return (
    <>
      <IconButton
        aria-label="Ver detalle"
        icon={<FiEye />}
        onClick={onOpen}
        variant="ghost"
        size="lg"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            Detalle de la estantería
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            pb="0"
            maxH="30rem"
            overflow="auto"
            sx={{
              '&::-webkit-scrollbar': { display: 'none' },
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <VStack spacing="0.75rem">
              {detailField('Nombre', shelve.name)}
              {detailField('Descripción', shelve.description)}
              {detailField('Almacén padre', shelve.warehouse?.name)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" flexDir="column" gap="0.75rem" w="100%">
              {canEditWarehouses && (
                <Button
                  bg="#4C88D8"
                  color="white"
                  _hover={{ backgroundColor: '#376bb0' }}
                  width="100%"
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    handleClose();
                    openEdit();
                  }}
                >
                  Editar
                </Button>
              )}
              {canDeleteWarehouses && (
                <GenericDelete
                  item={{ id: shelve.id, name: shelve.name }}
                  useDeleteHook={useDeleteShelve}
                  setItems={setWarehouses}
                  onDeleted={handleClose}
                />
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <ShelveEdit isOpen={isEditOpen} onClose={closeEdit} shelve={shelve} setWarehouses={setWarehouses} />
      )}
    </>
  );
};
