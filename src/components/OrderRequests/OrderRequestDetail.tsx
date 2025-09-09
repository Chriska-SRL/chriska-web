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
import { OrderRequest } from '@/entities/orderRequest';
import {
  FiInfo,
  FiEdit,
  FiCheckCircle,
  FiUsers,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPackage,
  FiDollarSign,
  FiX,
} from 'react-icons/fi';
import { OrderRequestEdit } from './OrderRequestEdit';
import { useChangeOrderRequestStatus } from '@/hooks/orderRequest';
// Removed getBestDiscount and Discount imports - no longer needed
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { getStatusLabel, Status } from '@/enums/status.enum';
import { UnitType } from '@/enums/unitType.enum';

type OrderRequestDetailProps = {
  orderRequest: OrderRequest;
  setOrderRequests: React.Dispatch<React.SetStateAction<OrderRequest[]>>;
};

export const OrderRequestDetail = ({ orderRequest, setOrderRequests }: OrderRequestDetailProps) => {
  const canEditOrderRequests = useUserStore((s) => s.hasPermission(Permission.EDIT_ORDER_REQUESTS));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isConfirmDialogOpen, onOpen: openConfirmDialog, onClose: closeConfirmDialog } = useDisclosure();
  const { isOpen: isCancelDialogOpen, onOpen: openCancelDialog, onClose: closeCancelDialog } = useDisclosure();
  const [statusProps, setStatusProps] = useState<{ id: number; status: string }>();
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  // Removed productDiscounts and isLoadingDiscounts - no longer needed
  const {
    data: statusData,
    isLoading: statusLoading,
    fieldError: statusError,
  } = useChangeOrderRequestStatus(statusProps);
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

  const calculateSubtotal = () => {
    return (
      orderRequest.productItems?.reduce((total, item) => {
        const basePrice = item.unitPrice;
        const quantity = item.quantity;

        // Calculate based on unitType
        if (item.product?.unitType === UnitType.KILO) {
          const estimatedWeight = item.product?.estimatedWeight || 0;
          return total + quantity * (estimatedWeight / 1000) * basePrice;
        } else {
          return total + quantity * basePrice;
        }
      }, 0) || 0
    );
  };

  const calculateDiscount = () => {
    return (
      orderRequest.productItems?.reduce((total, item) => {
        const basePrice = item.unitPrice;
        const quantity = item.quantity;

        // Calculate base amount considering unitType
        const baseAmount = (() => {
          if (item.product?.unitType === UnitType.KILO) {
            const estimatedWeight = item.product?.estimatedWeight || 0;
            return quantity * (estimatedWeight / 1000) * basePrice;
          } else {
            return quantity * basePrice;
          }
        })();

        // Always use the discount that was stored when the item was added to the order
        if (item.discount > 0) {
          return total + (baseAmount * item.discount) / 100;
        }
        return total; // No discount applied
      }, 0) || 0
    );
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
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

  const handleConfirmOrder = useCallback(() => {
    if (statusLoading || statusProps) return;
    closeConfirmDialog();
    setActionType('confirm');
    setStatusProps({ id: orderRequest.id, status: Status.CONFIRMED });
  }, [statusLoading, statusProps, orderRequest.id, closeConfirmDialog]);

  const handleCancelOrder = useCallback(() => {
    if (statusLoading || statusProps) return;
    closeCancelDialog();
    setActionType('cancel');
    setStatusProps({ id: orderRequest.id, status: 'Cancelled' });
  }, [statusLoading, statusProps, orderRequest.id, closeCancelDialog]);

  useEffect(() => {
    if (statusData) {
      setOrderRequests((prev) => prev.map((or) => (or.id === orderRequest.id ? statusData : or)));
      const isConfirmed = statusData.status?.toLowerCase() === Status.CONFIRMED.toLowerCase();
      const isCancelled = statusData.status?.toLowerCase() === 'Cancelled';

      toast({
        title: isConfirmed ? 'Pedido confirmado' : isCancelled ? 'Pedido cancelado' : 'Estado actualizado',
        description: isConfirmed
          ? 'El pedido ha sido confirmado exitosamente'
          : isCancelled
            ? 'El pedido ha sido cancelado exitosamente'
            : 'El estado del pedido ha sido actualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setStatusProps(undefined);
      setActionType(null);
      onClose(); // Cerrar el modal de detail
    }
  }, [statusData, setOrderRequests, toast, orderRequest.id, onClose]);

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

  // No longer need to fetch discounts - always use stored discount values

  return (
    <>
      <IconButton
        aria-label="Ver detalle"
        icon={<FiInfo />}
        onClick={onOpen}
        variant="ghost"
        size="md"
        _hover={{ bg: hoverBgIcon }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'full', md: 'xl' }} isCentered>
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
            Detalle del Pedido #{orderRequest.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Cliente', orderRequest.client?.name, FiUsers)}
                {detailField('Usuario', orderRequest.user?.name, FiUser)}
              </Stack>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Fecha del pedido', formatDate(orderRequest.date), FiCalendar)}
                {detailField('Estado', getStatusLabel(orderRequest.status), FiPackage)}
              </Stack>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField(
                  'Fecha de confirmación',
                  orderRequest.confirmedDate ? formatDate(orderRequest.confirmedDate) : 'No confirmado',
                  FiCalendar,
                )}
                <Box w="100%">
                  <HStack mb="0.5rem" spacing="0.5rem">
                    <Icon as={FiDollarSign} boxSize="1rem" color={iconColor} />
                    <Text color={labelColor} fontWeight="semibold">
                      Total
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
                    display="flex"
                    alignItems="center"
                  >
                    <Text>{`$${calculateTotal().toFixed(2)}`}</Text>
                  </Box>
                </Box>
              </Stack>

              {orderRequest.observations && detailField('Observaciones', orderRequest.observations, FiFileText)}

              <Divider />

              <Box w="100%">
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiPackage} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Productos ({orderRequest.productItems?.length || 0})
                  </Text>
                </HStack>
                {orderRequest.productItems && orderRequest.productItems.length > 0 ? (
                  <VStack spacing="0.5rem" align="stretch" maxH="300px" overflowY="auto">
                    {orderRequest.productItems.map((item, index) => {
                      // Calcular subtotal basado en unitType
                      const subtotal = (() => {
                        const basePrice = item.unitPrice;
                        const quantity = item.quantity;

                        if (item.product?.unitType === UnitType.KILO) {
                          const estimatedWeight = item.product?.estimatedWeight || 0;
                          return quantity * (estimatedWeight / 1000) * basePrice;
                        } else {
                          return quantity * basePrice;
                        }
                      })();

                      // Always use the stored discount percentage
                      const discount = (() => {
                        if (item.discount > 0) {
                          return subtotal * (item.discount / 100);
                        }
                        return 0;
                      })();

                      // Calculate final total with stored discount
                      const total = subtotal - discount;

                      return (
                        <Box
                          key={index}
                          p={{ base: '0.75rem', md: '0.75rem 1rem' }}
                          border="1px solid"
                          borderColor={inputBorder}
                          borderRadius="md"
                          bg={inputBg}
                        >
                          <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: '0.75rem', md: '1rem' }}>
                            {/* Imagen y nombre del producto */}
                            <Flex align="center" gap="0.75rem" flex={{ base: 'auto', md: '1' }}>
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
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.product?.name || '-'}
                                </Text>
                                <HStack spacing="0.5rem" align="center" mt="0.25rem">
                                  {item.discount > 0 ? (
                                    <>
                                      <Text fontSize="xs" color={textColor} textDecoration="line-through">
                                        ${item.unitPrice.toFixed(2)}
                                      </Text>
                                      <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                        ${(item.unitPrice * (1 - item.discount / 100)).toFixed(2)}
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
                                {item.product?.unitType === UnitType.KILO && (
                                  <Text fontSize="xs" color={textColor} mt="0.25rem">
                                    Peso estimado: {item.product?.estimatedWeight || 0}g
                                  </Text>
                                )}
                              </Box>
                            </Flex>

                            {/* Desktop: Cantidad, descuento y subtotal en línea */}
                            <Flex display={{ base: 'none', md: 'flex' }} align="center" gap="2rem">
                              <VStack spacing="0.25rem" align="center" minW="80px">
                                <Text fontSize="xs" color={textColor}>
                                  Cantidad
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.quantity}
                                </Text>
                              </VStack>
                              <VStack spacing="0.25rem" align="center" minW="80px">
                                <Text fontSize="xs" color={textColor}>
                                  Subtotal
                                </Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  ${total.toFixed(2)}
                                </Text>
                              </VStack>
                            </Flex>

                            {/* Mobile: Cantidad y subtotal en fila horizontal */}
                            <Flex display={{ base: 'flex', md: 'none' }} justify="space-between" align="center">
                              <HStack spacing="0.5rem">
                                <Text fontSize="xs" color={textColor}>
                                  Cantidad:
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.quantity}
                                </Text>
                              </HStack>

                              <HStack spacing="0.5rem">
                                <Text fontSize="xs" color={textColor}>
                                  Subt.:
                                </Text>
                                <Text fontSize="sm" fontWeight="bold">
                                  ${total.toFixed(2)}
                                </Text>
                              </HStack>
                            </Flex>
                          </Flex>
                        </Box>
                      );
                    })}
                  </VStack>
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
                      No hay productos en este pedido
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            {orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() ? (
              <Stack
                direction={{ base: 'column-reverse', md: 'row' }}
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

                {/* Botón Cancelar - único */}
                <Button
                  leftIcon={<FiX />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={openCancelDialog}
                  isLoading={statusLoading && actionType === 'cancel'}
                  disabled={statusLoading || !!statusProps}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 2, md: 2 }}
                >
                  Cancelar
                </Button>

                {/* Botón Confirmar - único */}
                <Button
                  leftIcon={<FiCheckCircle />}
                  colorScheme="green"
                  variant="outline"
                  size="sm"
                  onClick={openConfirmDialog}
                  isLoading={statusLoading && actionType === 'confirm'}
                  disabled={statusLoading || !!statusProps}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 3, md: 3 }}
                >
                  Confirmar
                </Button>

                {/* Botón Editar - único */}
                {canEditOrderRequests && (
                  <Button
                    leftIcon={<FiEdit />}
                    onClick={() => {
                      openEdit();
                      onClose();
                    }}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    disabled={statusLoading || !!statusProps}
                    w={{ base: '100%', md: 'auto' }}
                    order={{ base: 4, md: 4 }}
                  >
                    Editar
                  </Button>
                )}
              </Stack>
            ) : (
              // Botón Cerrar para pedidos confirmados/cancelados
              <HStack justify="flex-end" w="100%">
                <Button variant="ghost" onClick={onClose} size="sm">
                  Cerrar
                </Button>
              </HStack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <OrderRequestEdit
          orderRequest={orderRequest}
          isOpen={isEditOpen}
          onClose={closeEdit}
          setOrderRequests={setOrderRequests}
        />
      )}

      {/* Modal de confirmación para confirmar pedido */}
      <AlertDialog isOpen={isConfirmDialogOpen} leastDestructiveRef={cancelRef} onClose={closeConfirmDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Confirmar pedido
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas confirmar el pedido #{orderRequest.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={cancelRef} onClick={closeConfirmDialog} variant="ghost" size="sm">
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleConfirmOrder}
              isLoading={statusLoading && actionType === 'confirm'}
              variant="outline"
              size="sm"
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmación para cancelar pedido */}
      <AlertDialog isOpen={isCancelDialogOpen} leastDestructiveRef={cancelRef} onClose={closeCancelDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Cancelar pedido
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas cancelar el pedido #{orderRequest.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={cancelRef} onClick={closeCancelDialog} variant="ghost" size="sm">
              No cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={handleCancelOrder}
              isLoading={statusLoading && actionType === 'cancel'}
              variant="outline"
              size="sm"
            >
              Sí, cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
