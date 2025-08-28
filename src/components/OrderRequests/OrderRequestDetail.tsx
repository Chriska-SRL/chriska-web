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
  Spinner,
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
import { getBestDiscount } from '@/services/discount';
import type { Discount } from '@/entities/discount';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { getStatusLabel, Status } from '@/enums/status.enum';

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
  const [productDiscounts, setProductDiscounts] = useState<{
    [productId: number]: { discount: Discount | null; loading: boolean };
  }>({});
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
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
        if (orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase()) {
          // Para pending: usar precios actuales
          return total + item.quantity * item.unitPrice;
        } else {
          // Para confirmados: item.unitPrice es el precio original
          return total + item.quantity * item.unitPrice;
        }
      }, 0) || 0
    );
  };

  const calculateDiscount = () => {
    return (
      orderRequest.productItems?.reduce((total, item) => {
        if (orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase()) {
          // Para pending: usar descuentos actuales del endpoint con lógica de cantidad mínima
          const productDiscount = productDiscounts[item.product.id];
          if (productDiscount?.discount) {
            const minQuantity = productDiscount.discount.productQuantity;
            if (item.quantity >= minQuantity) {
              // Solo aplicar descuento si se cumple la cantidad mínima
              return total + (item.quantity * item.unitPrice * productDiscount.discount.percentage) / 100;
            }
          }
          return total; // Sin descuento si no se cumple la cantidad mínima
        } else {
          // Para confirmados: item.unitPrice es el precio original, item.discount es el porcentaje
          if (item.discount > 0) {
            const discountAmount = item.unitPrice * (item.discount / 100);
            return total + item.quantity * discountAmount;
          }
          return total; // Sin descuento aplicado
        }
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

  // Obtener descuentos reales cuando se abre el modal (solo si está pending)
  useEffect(() => {
    const fetchDiscounts = async () => {
      // Solo obtener descuentos si el pedido está pending
      if (
        isOpen &&
        orderRequest.productItems &&
        orderRequest.client &&
        orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase()
      ) {
        setIsLoadingDiscounts(true);

        // Marcar todos los productos como cargando
        const loadingState: { [productId: number]: { discount: Discount | null; loading: boolean } } = {};
        orderRequest.productItems.forEach((item) => {
          loadingState[item.product.id] = { discount: null, loading: true };
        });
        setProductDiscounts(loadingState);

        // Obtener descuentos para cada producto
        const discountPromises = orderRequest.productItems.map(async (item) => {
          try {
            const bestDiscount = await getBestDiscount(item.product.id, orderRequest.client.id);
            setProductDiscounts((prev) => ({
              ...prev,
              [item.product.id]: {
                discount: bestDiscount,
                loading: false,
              },
            }));
          } catch (error) {
            console.error('Error getting best discount for product', item.product.id, error);
            setProductDiscounts((prev) => ({
              ...prev,
              [item.product.id]: {
                discount: null,
                loading: false,
              },
            }));
          }
        });

        await Promise.all(discountPromises);
        setIsLoadingDiscounts(false);
      }
    };

    fetchDiscounts();
  }, [isOpen, orderRequest.productItems, orderRequest.client, orderRequest.status]);

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'xl' }} isCentered>
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
                    {orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() && isLoadingDiscounts ? (
                      <Spinner size="sm" />
                    ) : (
                      <Text>{`$${calculateTotal().toFixed(2)}`}</Text>
                    )}
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
                      const productDiscount = productDiscounts[item.product.id];
                      const isLoadingDiscount = productDiscount?.loading || false;

                      // Calcular subtotal basado en el estado del pedido
                      const subtotal = (() => {
                        if (orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase()) {
                          // Para pending: usar precio actual
                          return item.quantity * item.unitPrice;
                        } else {
                          // Para confirmados: item.unitPrice es el precio original
                          return item.quantity * item.unitPrice;
                        }
                      })();

                      // Calcular descuento aplicado según cantidad mínima
                      const discount = (() => {
                        if (
                          orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() &&
                          productDiscount?.discount
                        ) {
                          const minQuantity = productDiscount.discount.productQuantity;
                          if (item.quantity >= minQuantity) {
                            return subtotal * (productDiscount.discount.percentage / 100);
                          }
                          return 0; // Sin descuento si no se cumple cantidad mínima
                        }
                        // Para estados no pending: item.unitPrice es el precio original, item.discount es el porcentaje
                        if (item.discount > 0) {
                          const discountAmount = item.unitPrice * (item.discount / 100);
                          return item.quantity * discountAmount;
                        }
                        return 0;
                      })();

                      // El total final debe ser el precio que realmente se paga
                      const total = (() => {
                        if (orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase()) {
                          return subtotal - discount;
                        } else {
                          // Para confirmados: calcular precio final con descuento aplicado
                          const finalPrice = item.unitPrice * (1 - item.discount / 100);
                          return item.quantity * finalPrice;
                        }
                      })();

                      return (
                        <Box
                          key={index}
                          p={{ base: '0.75rem', md: '0.75rem 1.5rem' }}
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
                                  {orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() ? (
                                    // Para pending: usar descuentos actuales del endpoint
                                    isLoadingDiscount ? (
                                      <>
                                        <Text fontSize="xs" color={textColor}>
                                          ${item.unitPrice.toFixed(2)}
                                        </Text>
                                        <Spinner size="xs" />
                                        <Text fontSize="xs" color="gray.500">
                                          Cargando...
                                        </Text>
                                      </>
                                    ) : productDiscount?.discount &&
                                      item.quantity >= productDiscount.discount.productQuantity ? (
                                      <>
                                        {/* Solo mostrar descuento si se cumple cantidad mínima */}
                                        <Text fontSize="xs" color={textColor} textDecoration="line-through">
                                          ${item.unitPrice.toFixed(2)}
                                        </Text>
                                        <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                          $
                                          {(item.unitPrice * (1 - productDiscount.discount.percentage / 100)).toFixed(
                                            2,
                                          )}
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
                                          -{productDiscount.discount.percentage}%
                                        </Box>
                                      </>
                                    ) : (
                                      <Text fontSize="xs" color={textColor}>
                                        ${item.unitPrice.toFixed(2)}
                                      </Text>
                                    )
                                  ) : // Para confirmados/cancelados: item.unitPrice es precio original, item.discount es porcentaje
                                  item.discount > 0 ? (
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
                                {orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() &&
                                isLoadingDiscounts ? (
                                  <Spinner size="xs" />
                                ) : (
                                  <Text fontSize="sm" fontWeight="bold">
                                    ${total.toFixed(2)}
                                  </Text>
                                )}
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
                                {orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() &&
                                isLoadingDiscounts ? (
                                  <Spinner size="xs" />
                                ) : (
                                  <Text fontSize="sm" fontWeight="bold">
                                    ${total.toFixed(2)}
                                  </Text>
                                )}
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
