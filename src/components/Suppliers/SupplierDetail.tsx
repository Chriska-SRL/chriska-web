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
  SimpleGrid,
  Divider,
  HStack,
  Stack,
} from '@chakra-ui/react';
import { FiInfo, FiUser, FiHash, FiMapPin, FiPhone, FiMail, FiFileText, FiDollarSign, FiMap } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Supplier } from '@/entities/supplier';
import { SupplierEdit } from './SupplierEdit';
import { useDeleteSupplier } from '@/hooks/supplier';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { GenericDelete } from '../shared/GenericDelete';
import { useEffect, useCallback } from 'react';
import MapPreview from '../MapPreview';
import { MapViewModal } from '../MapViewModal';

type SupplierDetailProps = {
  supplier: Supplier;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const SupplierDetail = ({ supplier, setSuppliers, forceOpen, onModalClose }: SupplierDetailProps) => {
  const canEditSuppliers = useUserStore((s) => s.hasPermission(Permission.EDIT_SUPPLIERS));
  const canDeleteSuppliers = useUserStore((s) => s.hasPermission(Permission.DELETE_SUPPLIERS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isMapOpen, onOpen: openMap, onClose: closeMap } = useDisclosure();

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
        icon={<FiInfo />}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'full', md: 'xl' }} isCentered>
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
            Detalle del proveedor
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Nombre', supplier.name, FiUser)}
                {detailField('RUT', supplier.rut, FiHash)}
              </SimpleGrid>

              {detailField('Razón Social', supplier.razonSocial, FiFileText)}

              {detailField('Dirección', supplier.address, FiMapPin)}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Persona de contacto', supplier.contactName, FiUser)}
                {detailField('Teléfono', supplier.phone, FiPhone)}
              </SimpleGrid>

              {detailField('Email', supplier.email, FiMail)}

              {/* Ubicación con preview del mapa */}
              <Box w="100%">
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiMap} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Ubicación
                  </Text>
                </HStack>
                <VStack spacing="0.5rem" align="stretch">
                  {supplier.location ? (
                    <Box bg={inputBg} border="1px solid" borderColor={inputBorder} borderRadius="md" p="0.5rem">
                      <MapPreview
                        lat={supplier.location.latitude}
                        lng={supplier.location.longitude}
                        height="15rem"
                        onClick={openMap}
                      />
                    </Box>
                  ) : (
                    <Box
                      px="1rem"
                      py="0.5rem"
                      bg={inputBg}
                      border="1px solid"
                      borderColor={inputBorder}
                      borderRadius="md"
                      minH="2.75rem"
                      display="flex"
                      alignItems="center"
                    >
                      <Text color="gray.500" fontSize="sm">
                        No se ha configurado ubicación
                      </Text>
                    </Box>
                  )}
                </VStack>
              </Box>

              <Divider />

              <Box>
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiDollarSign} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Cuentas bancarias
                  </Text>
                </HStack>
                <Box
                  px="1rem"
                  py="0.75rem"
                  bg={inputBg}
                  border="1px solid"
                  borderColor={inputBorder}
                  borderRadius="md"
                  maxH="200px"
                  overflowY="auto"
                >
                  {supplier.bankAccounts && supplier.bankAccounts.length > 0 ? (
                    <VStack spacing="0.5rem" align="stretch">
                      {supplier.bankAccounts.map((account, index) => (
                        <Box key={`bank-account-${index}`} p="0.5rem" bg="whiteAlpha.50" borderRadius="md">
                          <Text fontSize="sm" fontWeight="medium">
                            {account.accountName}
                          </Text>
                          <Text fontSize="xs" color={iconColor}>
                            {account.bank} - {account.accountNumber}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color={iconColor}>No hay cuentas bancarias registradas</Text>
                  )}
                </Box>
              </Box>

              <Divider />

              {detailField('Observaciones', supplier.observations, FiFileText)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <Stack
              direction={{ base: 'column-reverse', md: 'row' }}
              spacing="0.5rem"
              w="100%"
              align="stretch"
              justify={{ base: 'stretch', md: 'flex-end' }}
            >
              <Button variant="ghost" size="sm" onClick={handleClose}>
                Cerrar
              </Button>
              {canDeleteSuppliers && (
                <GenericDelete
                  item={{ id: supplier.id, name: supplier.name }}
                  useDeleteHook={useDeleteSupplier}
                  setItems={setSuppliers}
                  onDeleted={handleClose}
                  size="sm"
                  variant="outline"
                />
              )}
              {canEditSuppliers && (
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
            </Stack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <SupplierEdit isOpen={isEditOpen} onClose={closeEdit} supplier={supplier} setSuppliers={setSuppliers} />

      {supplier?.location && (
        <MapViewModal
          isOpen={isMapOpen}
          onClose={closeMap}
          lat={supplier.location.latitude}
          lng={supplier.location.longitude}
          title={`Ubicación de ${supplier.name}`}
        />
      )}
    </>
  );
};
