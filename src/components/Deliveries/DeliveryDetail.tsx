'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  Text,
  VStack,
  HStack,
  Stack,
  Divider,
  Box,
  IconButton,
  useColorModeValue,
  Icon,
  Image,
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { Delivery } from '@/entities/delivery';
import {
  FiEye,
  FiCheckCircle,
  FiUsers,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPackage,
  FiX,
  FiEdit,
  FiDollarSign,
} from 'react-icons/fi';
import { useChangeDeliveryStatus } from '@/hooks/delivery';
import { DeliveryEdit } from './DeliveryEdit';
import { DeliveryConfirm } from './DeliveryConfirm';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { getStatusLabel, Status } from '@/enums/status.enum';
import { UnitType } from '@/enums/unitType.enum';

type DeliveryDetailProps = {
  delivery: Delivery;
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
};

export const DeliveryDetail = ({ delivery, setDeliveries }: DeliveryDetailProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isStatusDialogOpen, onOpen: openStatusDialog, onClose: closeStatusDialog } = useDisclosure();
  const { isOpen: isConfirmDialogOpen, onOpen: openConfirmDialog, onClose: closeConfirmDialog } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const [statusProps, setStatusProps] = useState<{ id: number; status: string }>();
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const { data: statusData, isLoading: statusLoading, fieldError: statusError } = useChangeDeliveryStatus(statusProps);
  const toast = useToast();
  const cancelRef = useRef(null);

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
    }
  };

  const isValidDate = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    // Verificar si es una fecha válida y no es 01/01/0001
    return date.getFullYear() > 1900;
  };

  const calculateSubtotal = () => {
    return (
      delivery.productItems?.reduce((total, item) => {
        // Para todos los estados: calcular precio original sin descuento
        const originalPrice = item.unitPrice / (1 - item.discount / 100);
        return total + item.quantity * originalPrice;
      }, 0) || 0
    );
  };

  const calculateDiscount = () => {
    return (
      delivery.productItems?.reduce((total, item) => {
        // Para todos los estados: usar descuentos almacenados
        const originalPrice = item.unitPrice / (1 - item.discount / 100);
        const discountAmount = originalPrice - item.unitPrice;
        return total + item.quantity * discountAmount;
      }, 0) || 0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleConfirmDelivery = useCallback(() => {
    if (statusLoading || statusProps) return;
    setActionType('confirm');
    openConfirmDialog();
  }, [statusLoading, statusProps, openConfirmDialog]);

  const handleCancelDelivery = useCallback(() => {
    if (statusLoading || statusProps) return;
    setActionType('cancel');
    openStatusDialog();
  }, [statusLoading, statusProps, openStatusDialog]);

  const confirmStatusChange = useCallback(() => {
    if (actionType === 'cancel') {
      setStatusProps({ id: delivery.id, status: Status.CANCELLED });
    }
    closeStatusDialog();
  }, [actionType, delivery.id, closeStatusDialog]);

  const handleDeliveryUpdated = useCallback(
    (updatedDelivery: Delivery) => {
      setDeliveries((prev) => prev.map((d) => (d.id === updatedDelivery.id ? updatedDelivery : d)));
      closeConfirmDialog();
      onClose(); // Cerrar modal principal
    },
    [setDeliveries, closeConfirmDialog, onClose],
  );

  useEffect(() => {
    if (statusData) {
      setDeliveries((prev) => prev.map((d) => (d.id === statusData.id ? statusData : d)));

      const isConfirmed = statusData.status?.toLowerCase() === Status.CONFIRMED.toLowerCase();
      const isCancelled = statusData.status?.toLowerCase() === Status.CANCELLED.toLowerCase();

      toast({
        title: isConfirmed ? 'Entrega confirmada' : isCancelled ? 'Entrega cancelada' : 'Estado actualizado',
        description: isConfirmed
          ? 'La entrega ha sido confirmada exitosamente.'
          : isCancelled
            ? 'La entrega ha sido cancelada exitosamente.'
            : 'El estado de la entrega ha sido actualizado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setStatusProps(undefined);
      setActionType(null);

      // Cerrar los modales después de confirmar o cancelar
      if (isConfirmed || isCancelled) {
        closeConfirmDialog(); // Cerrar modal de confirmación
        closeStatusDialog(); // Cerrar modal de cancelación
        onClose(); // Cerrar modal principal
      }
    }
  }, [statusData, setDeliveries, toast, onClose, closeConfirmDialog, closeStatusDialog]);

  useEffect(() => {
    if (statusError) {
      toast({
        title: 'Error',
        description: statusError.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [statusError, toast]);

  // Ya no necesitamos obtener descuentos del endpoint /best
  // Ahora PENDING también usa el descuento almacenado

  const detailField = (label: string, value: string | number | null | undefined, icon?: any, textColor?: string) => (
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
        color={textColor}
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
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'xl' }} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxH="90vh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Detalle de la Entrega #{delivery.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {/* Fila 1: Cliente - Usuario */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Cliente', delivery.client?.name, FiUsers)}
                {detailField('Usuario', delivery.user?.name, FiUser)}
              </Stack>

              {/* Fila 2: Fecha de entrega - Fecha de confirmación */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Fecha de la entrega', formatDate(delivery.date), FiCalendar)}
                {detailField(
                  'Fecha de confirmación',
                  isValidDate(delivery.confirmedDate) ? formatDate(delivery.confirmedDate) : 'No confirmado',
                  FiCheckCircle,
                )}
              </Stack>

              {/* Fila 3: Estado - Total */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Estado', getStatusLabel(delivery.status), FiPackage)}
                {detailField('Total', `$${(calculateSubtotal() - calculateDiscount()).toFixed(2)}`, FiDollarSign)}
              </Stack>

              {/* Fila 4: Cajones utilizados - Cajones devueltos */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField(
                  'Cajones utilizados',
                  delivery.order?.crates && delivery.order.crates > 0
                    ? delivery.order.crates.toString()
                    : 'No definido',
                  FiPackage,
                )}
                {detailField(
                  'Cajones devueltos',
                  delivery.status?.toLowerCase() === Status.PENDING.toLowerCase()
                    ? '-'
                    : delivery.crates?.toString() || '0',
                  FiPackage,
                )}
              </Stack>

              {/* Fila 5: Observaciones */}
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Observaciones', delivery.observations || 'Sin observaciones', FiFileText)}
              </Stack>

              <Divider />

              <Box w="100%">
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiPackage} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Productos ({delivery.productItems?.length || 0})
                  </Text>
                </HStack>
                {delivery.productItems && delivery.productItems.length > 0 ? (
                  <>
                    <VStack spacing="0.5rem" align="stretch" maxH="400px" overflowY="auto">
                      {delivery.productItems.map((item, index) => {
                        // Por ahora, cantidad real = cantidad solicitada
                        const requestedQuantity = item.quantity;
                        const actualQuantity = item.quantity;
                        const weight = item.product?.unitType === UnitType.KILO ? actualQuantity : null;

                        // Para todos los estados: el unitPrice ya tiene el descuento aplicado
                        const total = actualQuantity * item.unitPrice;

                        return (
                          <Box
                            key={index}
                            p={{ base: '0.75rem', md: '0.75rem' }}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="md"
                            bg={inputBg}
                          >
                            {/* Desktop Layout */}
                            <Box display={{ base: 'none', md: 'block' }}>
                              {/* Primera fila desktop: Imagen + Nombre + Precio */}
                              <Flex gap="0.75rem" mb="0.75rem">
                                <Image
                                  src={
                                    item.product?.imageUrl ||
                                    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                  }
                                  alt={item.product?.name || 'Producto'}
                                  boxSize="50px"
                                  objectFit="cover"
                                  borderRadius="md"
                                  flexShrink={0}
                                />
                                <Box flex="1" alignSelf="center">
                                  <Text fontSize="sm" fontWeight="medium" mb="0.25rem" noOfLines={1}>
                                    {item.product?.name || '-'}
                                  </Text>
                                  <HStack spacing="0.5rem" align="center">
                                    {item.discount > 0 ? (
                                      <>
                                        <Text fontSize="xs" color={textColor} textDecoration="line-through">
                                          ${(item.unitPrice / (1 - item.discount / 100)).toFixed(2)}
                                        </Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                          ${item.unitPrice.toFixed(2)}
                                        </Text>
                                        <Box
                                          bg="green.500"
                                          color="white"
                                          px="0.4rem"
                                          py="0.1rem"
                                          borderRadius="md"
                                          fontSize="xs"
                                          fontWeight="bold"
                                        >
                                          -{item.discount}%
                                        </Box>
                                      </>
                                    ) : (
                                      <Text fontSize="xs" color={textColor}>
                                        ${item.unitPrice.toFixed(2)}
                                      </Text>
                                    )}
                                  </HStack>
                                </Box>
                              </Flex>

                              {/* Segunda fila desktop: Cantidad solicitada + Cantidad real + Peso + Subtotal */}
                              <Flex justify="space-around" align="center">
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. solicitada
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {requestedQuantity}
                                  </Text>
                                </VStack>

                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. real
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {actualQuantity}
                                  </Text>
                                </VStack>

                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Peso (kg)
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {item.product?.unitType === UnitType.KILO ? weight?.toFixed(2) || '-' : 'N/A'}
                                  </Text>
                                </VStack>

                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Subtotal
                                  </Text>
                                  <Text fontSize="md" fontWeight="bold">
                                    ${total.toFixed(2)}
                                  </Text>
                                </VStack>
                              </Flex>
                            </Box>

                            {/* Mobile Layout */}
                            <Box display={{ base: 'block', md: 'none' }}>
                              {/* Fila superior: Imagen + Nombre + Precio */}
                              <Flex align="flex-start" gap="0.75rem" mb="0.75rem">
                                <Image
                                  src={
                                    item.product?.imageUrl ||
                                    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                  }
                                  alt={item.product?.name || 'Producto'}
                                  boxSize="50px"
                                  objectFit="cover"
                                  borderRadius="md"
                                  flexShrink={0}
                                />
                                <Box flex="1">
                                  <Text fontSize="sm" fontWeight="medium" mb="0.25rem" noOfLines={1}>
                                    {item.product?.name || '-'}
                                  </Text>
                                  <HStack spacing="0.5rem" align="center">
                                    {item.discount > 0 ? (
                                      <>
                                        <Text fontSize="xs" color={textColor} textDecoration="line-through">
                                          ${(item.unitPrice / (1 - item.discount / 100)).toFixed(2)}
                                        </Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                          ${item.unitPrice.toFixed(2)}
                                        </Text>
                                        <Box
                                          bg="green.500"
                                          color="white"
                                          px="0.4rem"
                                          py="0.1rem"
                                          borderRadius="md"
                                          fontSize="xs"
                                          fontWeight="bold"
                                        >
                                          -{item.discount}%
                                        </Box>
                                      </>
                                    ) : (
                                      <Text fontSize="xs" color={textColor}>
                                        ${item.unitPrice.toFixed(2)}
                                      </Text>
                                    )}
                                  </HStack>
                                </Box>
                              </Flex>

                              {/* Fila media: Cantidad solicitada vs Cantidad real */}
                              <Flex justify="space-between" align="center" mb="0.75rem">
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. solicitada
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {requestedQuantity}
                                  </Text>
                                </VStack>
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. real
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {actualQuantity}
                                  </Text>
                                </VStack>
                              </Flex>

                              {/* Fila inferior: Peso + Subtotal */}
                              <Flex justify="space-between" align="center">
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Peso (kg)
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {item.product?.unitType === UnitType.KILO ? weight?.toFixed(2) || '-' : 'N/A'}
                                  </Text>
                                </VStack>
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Subtotal
                                  </Text>
                                  <Text fontSize="md" fontWeight="bold">
                                    ${total.toFixed(2)}
                                  </Text>
                                </VStack>
                              </Flex>
                            </Box>
                          </Box>
                        );
                      })}
                    </VStack>

                    {/* Total */}
                    <Box>
                      <Divider mt="1rem" mb="0.5rem" />
                      <HStack justify="space-between">
                        <Text fontSize="md" fontWeight="semibold">
                          Total:
                        </Text>
                        <Text fontSize="md" fontWeight="semibold">
                          ${calculateTotal().toFixed(2)}
                        </Text>
                      </HStack>
                    </Box>
                  </>
                ) : (
                  <Box
                    p="2rem"
                    border="1px solid"
                    borderColor={inputBorder}
                    borderRadius="md"
                    bg={inputBg}
                    textAlign="center"
                  >
                    <Text color={textColor} fontSize="sm">
                      No hay productos en esta entrega
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            {delivery.status === Status.PENDING ? (
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="0.5rem"
                w="100%"
                align="stretch"
                justify={{ base: 'stretch', md: 'flex-end' }}
              >
                {/* Botón Cerrar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={statusLoading}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 1, md: 1 }}
                >
                  Cerrar
                </Button>

                {/* Botón Cancelar */}
                <Button
                  leftIcon={<FiX />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelDelivery}
                  isLoading={statusLoading && actionType === 'cancel'}
                  disabled={statusLoading || !!statusProps}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 2, md: 2 }}
                >
                  Cancelar
                </Button>

                {/* Botón Confirmar */}
                <Button
                  leftIcon={<FiCheckCircle />}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                  onClick={handleConfirmDelivery}
                  isLoading={statusLoading && actionType === 'confirm'}
                  disabled={statusLoading || !!statusProps}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 3, md: 3 }}
                >
                  Confirmar
                </Button>

                {/* Botón Editar */}
                <Button
                  leftIcon={<FiEdit />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={openEdit}
                  disabled={statusLoading}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 4, md: 4 }}
                >
                  Editar
                </Button>
              </Stack>
            ) : (
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="0.5rem"
                w="100%"
                align="stretch"
                justify={{ base: 'stretch', md: 'flex-end' }}
              >
                {/* Botón Cerrar para entregas confirmadas/canceladas */}
                <Button variant="ghost" size="sm" onClick={onClose} w={{ base: '100%', md: 'auto' }}>
                  Cerrar
                </Button>

                {/* Botón Editar para entregas confirmadas/canceladas - solo mostrar si no está confirmado */}
                {delivery.status?.toLowerCase() !== Status.CONFIRMED.toLowerCase() && (
                  <Button
                    leftIcon={<FiEdit />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={openEdit}
                    w={{ base: '100%', md: 'auto' }}
                  >
                    Editar
                  </Button>
                )}
              </Stack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de confirmación para cancelar entrega */}
      <AlertDialog isOpen={isStatusDialogOpen} leastDestructiveRef={cancelRef} onClose={closeStatusDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Cancelar entrega
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas cancelar la entrega #{delivery.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={cancelRef} onClick={closeStatusDialog} variant="ghost" size="sm">
              No cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={confirmStatusChange}
              isLoading={statusLoading && actionType === 'cancel'}
              variant="outline"
              size="sm"
            >
              Sí, cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmación para confirmar entrega */}
      <DeliveryConfirm
        isOpen={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        delivery={delivery}
        onDeliveryUpdated={handleDeliveryUpdated}
      />

      {/* Modal de edición */}
      <DeliveryEdit isOpen={isEditOpen} onClose={closeEdit} delivery={delivery} setDeliveries={setDeliveries} />
    </>
  );
};
