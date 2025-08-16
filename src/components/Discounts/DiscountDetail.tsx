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
  Icon,
  SimpleGrid,
  Divider,
  HStack,
  useToast,
} from '@chakra-ui/react';
import {
  FiEye,
  FiPercent,
  FiCalendar,
  FiPackage,
  FiMapPin,
  FiTag,
  FiFileText,
  FiCheckCircle,
  FiGrid,
} from 'react-icons/fi';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Discount } from '@/entities/discount';
import { DiscountEdit } from './DiscountEdit';
import { useDeleteDiscount } from '@/hooks/discount';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { getDiscountStatusLabel } from '@/enums/discountStatus.enum';

type DiscountDetailProps = {
  discount: Discount;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
  forceOpen?: boolean;
  onModalClose?: () => void;
};

export const DiscountDetail = ({ discount, setDiscounts, forceOpen, onModalClose }: DiscountDetailProps) => {
  const canEditDiscounts = useUserStore((s) => s.hasPermission(Permission.EDIT_PRODUCTS)); // Asumiendo que se usa el mismo permiso
  const canDeleteDiscounts = useUserStore((s) => s.hasPermission(Permission.DELETE_PRODUCTS)); // Asumiendo que se usa el mismo permiso

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();

  const [deleteId, setDeleteId] = useState<string>();
  const { data: deleteResult, isLoading: isDeleting, error: deleteError } = useDeleteDiscount(deleteId);

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

  useEffect(() => {
    if (deleteResult) {
      toast({
        title: 'Descuento eliminado',
        description: 'El descuento ha sido eliminado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setDiscounts((prev) => prev.filter((d) => d.id !== discount.id));
      setDeleteId(undefined);
      closeDelete();
      handleClose();
    }
  }, [deleteResult, setDiscounts, discount.id, toast, closeDelete, handleClose]);

  useEffect(() => {
    if (deleteError) {
      toast({
        title: 'Error al eliminar',
        description: deleteError,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [deleteError, toast]);

  const handleDelete = () => {
    openDelete();
  };

  const confirmDelete = () => {
    setDeleteId(discount.id);
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy');
    } catch {
      return date;
    }
  };

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

      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'xl' }} isCentered>
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
            Detalle del descuento
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Descripción', discount.description, FiFileText)}

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Porcentaje', `${discount.percentage}%`, FiPercent)}
                {detailField('Cantidad mínima', discount.productQuantity, FiPackage)}
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                {detailField('Fecha de vencimiento', formatDate(discount.expirationDate), FiCalendar)}
                {detailField('Estado', getDiscountStatusLabel(discount.status), FiCheckCircle)}
              </SimpleGrid>

              <Divider />

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing="0.75rem">
                {detailField('Marca', discount.brand?.name || 'No especificada', FiTag)}
                {detailField('Subcategoría', discount.subCategory?.name || 'No especificada', FiGrid)}
                {detailField('Zona', discount.zone?.name || 'No especificada', FiMapPin)}
              </SimpleGrid>

              <Divider />

              <Box>
                <Text fontSize="lg" fontWeight="bold" color={labelColor} mb="0.5rem">
                  Productos aplicables
                </Text>

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
                  {discount.products && discount.products.length > 0 ? (
                    <VStack spacing="0.5rem" align="stretch">
                      {discount.products.map((product) => (
                        <Box key={product.id} p="0.5rem" bg="whiteAlpha.50" borderRadius="md">
                          <Text fontSize="sm" fontWeight="medium">
                            {product.name}
                          </Text>
                          <Text fontSize="xs" color={iconColor}>
                            Código: {product.internalCode}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color={iconColor}>No hay productos específicos seleccionados</Text>
                  )}
                </Box>
              </Box>

              <Box>
                <Text fontSize="lg" fontWeight="bold" color={labelColor} mb="0.5rem">
                  Clientes aplicables
                </Text>

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
                  {discount.clients && discount.clients.length > 0 ? (
                    <VStack spacing="0.5rem" align="stretch">
                      {discount.clients.map((client) => (
                        <Box key={client.id} p="0.5rem" bg="whiteAlpha.50" borderRadius="md">
                          <Text fontSize="sm" fontWeight="medium">
                            {client.name}
                          </Text>
                          {client.email && (
                            <Text fontSize="xs" color={iconColor}>
                              {client.email}
                            </Text>
                          )}
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Text color={iconColor}>No hay clientes específicos seleccionados</Text>
                  )}
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              {canDeleteDiscounts && (
                <Button leftIcon={<FaTrash />} onClick={handleDelete} colorScheme="red" variant="outline" size="sm">
                  Eliminar
                </Button>
              )}
              {canEditDiscounts && (
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

      <DiscountEdit isOpen={isEditOpen} onClose={closeEdit} discount={discount} setDiscounts={setDiscounts} />

      {/* Modal de confirmación para eliminar */}
      <Modal isOpen={isDeleteOpen} onClose={closeDelete} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="0.75rem">Confirmar eliminación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar el descuento "{discount.description}"?</Text>
            <Text mt="0.5rem" fontSize="sm" color="gray.500">
              Esta acción no se puede deshacer.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={closeDelete}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={confirmDelete} isLoading={isDeleting} loadingText="Eliminando...">
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
