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
import { Supplier } from '@/entities/supplier';
import { SupplierEdit } from './SupplierEdit';
import { GenericDelete } from '../shared/GenericDelete';
import { useDeleteSupplier } from '@/hooks/supplier';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';

type SupplierDetailProps = {
  supplier: Supplier;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
};

export const SupplierDetail = ({ supplier, setSuppliers }: SupplierDetailProps) => {
  const canEditSuppliers = useUserStore((s) => s.hasPermission(PermissionId.EDIT_SUPPLIERS));
  const canDeleteSuppliers = useUserStore((s) => s.hasPermission(PermissionId.DELETE_SUPPLIERS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Detalle del proveedor
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="0" maxH="31rem" overflow="scroll">
            <VStack spacing="0.75rem">
              {detailField('Nombre', supplier.name)}
              {detailField('RUT', supplier.rut)}
              {detailField('Razón Social', supplier.razonSocial)}
              {detailField('Dirección', supplier.address)}
              {detailField('Dirección en Maps', supplier.mapsAddress)}
              {detailField('Teléfono', supplier.phone)}
              {detailField('Persona de contacto', supplier.contactName)}
              {detailField('Correo electrónico', supplier.email)}
              {detailField('Banco', supplier.bank)}
              {detailField('Cuenta bancaria', supplier.bankAccount)}
              {detailField('Observaciones', supplier.observations)}
            </VStack>
          </ModalBody>

          <ModalFooter py="1.5rem">
            <Box display="flex" gap="0.75rem" w="100%">
              {canDeleteSuppliers && (
                <GenericDelete
                  item={{ id: supplier.id, name: supplier.name }}
                  useDeleteHook={useDeleteSupplier}
                  setItems={setSuppliers}
                  onDeleted={onClose}
                />
              )}
              {canEditSuppliers && (
                <Button
                  bg="#4C88D8"
                  color="white"
                  _hover={{ backgroundColor: '#376bb0' }}
                  width="100%"
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    onClose();
                    openEdit();
                  }}
                >
                  Editar proveedor
                </Button>
              )}
            </Box>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <SupplierEdit isOpen={isEditOpen} onClose={closeEdit} supplier={supplier} setSuppliers={setSuppliers} />
      )}
    </>
  );
};
