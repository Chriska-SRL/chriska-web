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
import { Order } from '@/entities/order';
import { FiEye, FiCheckCircle, FiUsers, FiUser, FiCalendar, FiFileText, FiPackage, FiX } from 'react-icons/fi';
import { OrderPrepare } from './OrderPrepare';
import { useChangeOrderStatus } from '@/hooks/order';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import { getStatusLabel, Status } from '@/enums/status.enum';
import { UnitType } from '@/enums/unitType.enum';
import { getBestDiscount } from '@/services/discount';
import { getOrderRequestById } from '@/services/orderRequest';
import type { Discount } from '@/entities/discount';
import type { OrderRequest } from '@/entities/orderRequest';

type OrderDetailProps = {
  order: Order;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
};

export const OrderDetail = ({ order, setOrders }: OrderDetailProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isStatusDialogOpen, onOpen: openStatusDialog, onClose: closeStatusDialog } = useDisclosure();
  const { isOpen: isConfirmDialogOpen, onOpen: openConfirmDialog, onClose: closeConfirmDialog } = useDisclosure();
  const { isOpen: isPrepareOpen, onOpen: openPrepare, onClose: closePrepare } = useDisclosure();
  const { isOpen: isConfirmPreparedOpen, onOpen: openConfirmPrepared, onClose: closeConfirmPrepared } = useDisclosure();
  const [statusProps, setStatusProps] = useState<{ id: number; status: string }>();
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [preparedOrderData, setPreparedOrderData] = useState<Order | null>(null);
  const [discountData, setDiscountData] = useState<{ [productId: number]: { discount: Discount | null; isLoading: boolean } }>({});
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);
  const [orderRequestData, setOrderRequestData] = useState<OrderRequest | null>(null);
  const [isLoadingOrderRequest, setIsLoadingOrderRequest] = useState(false);
  const { data: statusData, isLoading: statusLoading, fieldError: statusError } = useChangeOrderStatus(statusProps);
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
      order.productItems?.reduce((total, item) => {
        // Siempre calcular precio original sin descuento
        const originalPrice = item.unitPrice / (1 - item.discount / 100);
        return total + item.quantity * originalPrice;
      }, 0) || 0
    );
  };

  const calculateDiscount = () => {
    if (order.status !== Status.PENDING) {
      // Para estados no PENDING: usar descuentos almacenados
      return (
        order.productItems?.reduce((total, item) => {
          const originalPrice = item.unitPrice / (1 - item.discount / 100);
          const discountAmount = originalPrice - item.unitPrice;
          return total + item.quantity * discountAmount;
        }, 0) || 0
      );
    }

    // Para PENDING: usar descuentos actualizados del endpoint /best
    return (
      order.productItems?.reduce((total, item) => {
        const originalPrice = item.unitPrice / (1 - item.discount / 100);
        const currentDiscount = discountData[item.product.id];
        
        if (currentDiscount?.discount) {
          // Solo aplicar descuento si se cumple la cantidad mínima
          const requestedQuantity = orderRequestData?.productItems?.find(pi => pi.product.id === item.product.id)?.quantity || item.quantity;
          const minQuantity = currentDiscount.discount.productQuantity;
          
          if (requestedQuantity >= minQuantity) {
            const discountAmount = originalPrice * (currentDiscount.discount.percentage / 100);
            return total + item.quantity * discountAmount;
          }
        }
        
        return total; // Sin descuento si no se cumple la cantidad mínima o no hay descuento
      }, 0) || 0
    );
  };

  const calculateTotal = () => {
    if (!order.productItems) return 0;
    
    // Usar la misma lógica simple que OrderList para todas las órdenes
    // Los subtotales individuales ya manejan correctamente los descuentos
    return order.productItems.reduce((total, item) => {
      // Para órdenes PENDING, solo ajustar si hay descuentos actualizados
      if (order.status === Status.PENDING) {
        const requestedItem = orderRequestData?.productItems?.find(
          (reqItem) => reqItem.product.id === item.product.id,
        );
        const requestedQuantity = requestedItem?.quantity || 0;
        const actualQuantity = item.quantity;
        const currentDiscount = discountData[item.product.id];
        
        // Si estamos cargando o no hay información de descuento, usar precio actual
        if (!currentDiscount || currentDiscount.isLoading) {
          return total + (actualQuantity * item.unitPrice);
        }
        
        if (currentDiscount.discount) {
          const originalPrice = item.unitPrice / (1 - item.discount / 100);
          const minQuantity = currentDiscount.discount.productQuantity;
          if (requestedQuantity >= minQuantity) {
            // Aplicar nuevo descuento
            const effectivePrice = originalPrice * (1 - currentDiscount.discount.percentage / 100);
            return total + (actualQuantity * effectivePrice);
          } else {
            // Sin descuento si no se cumple cantidad mínima
            return total + (actualQuantity * originalPrice);
          }
        }
      }
      
      // Para todos los otros casos: item.unitPrice ya tiene el descuento aplicado
      return total + (item.quantity * item.unitPrice);
    }, 0);
  };

  const handlePrepareOrder = useCallback(() => {
    onClose(); // Close OrderDetail modal first
    openPrepare();
  }, [onClose, openPrepare]);

  const handleConfirmOrder = useCallback(() => {
    if (statusLoading || statusProps) return;
    setActionType('confirm');
    openConfirmDialog();
  }, [statusLoading, statusProps, openConfirmDialog]);

  const handleCancelOrder = useCallback(() => {
    if (statusLoading || statusProps) return;
    setActionType('cancel');
    openStatusDialog();
  }, [statusLoading, statusProps, openStatusDialog]);

  const confirmStatusChange = useCallback(() => {
    if (actionType === 'cancel') {
      setStatusProps({ id: order.id, status: Status.CANCELLED });
    }
    closeStatusDialog();
  }, [actionType, order.id, closeStatusDialog]);

  const confirmOrderConfirmation = useCallback(() => {
    if (actionType === 'confirm') {
      setStatusProps({ id: order.id, status: Status.CONFIRMED });
    }
    closeConfirmDialog();
  }, [actionType, order.id, closeConfirmDialog]);

  const handleOrderPrepared = useCallback(
    (preparedOrder: Order) => {
      setPreparedOrderData(preparedOrder);
      openConfirmPrepared();
    },
    [openConfirmPrepared],
  );

  const handleConfirmPreparedOrder = useCallback(() => {
    if (preparedOrderData) {
      setStatusProps({ id: preparedOrderData.id, status: Status.CONFIRMED });
    }
    closeConfirmPrepared();
  }, [preparedOrderData, closeConfirmPrepared]);

  const handleContinueEditing = useCallback(() => {
    closeConfirmPrepared();
  }, [closeConfirmPrepared]);

  useEffect(() => {
    if (statusData) {
      setOrders((prev) => prev.map((o) => (o.id === statusData.id ? statusData : o)));

      const isConfirmed = statusData.status?.toLowerCase() === Status.CONFIRMED.toLowerCase();
      const isCancelled = statusData.status?.toLowerCase() === Status.CANCELLED.toLowerCase();

      toast({
        title: isConfirmed ? 'Orden confirmada' : isCancelled ? 'Orden cancelada' : 'Estado actualizado',
        description: isConfirmed
          ? 'La orden ha sido confirmada exitosamente.'
          : isCancelled
            ? 'La orden ha sido cancelada exitosamente.'
            : 'El estado de la orden ha sido actualizado correctamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setStatusProps(undefined);
      setActionType(null);

      // Cerrar el modal después de confirmar o cancelar
      if (isConfirmed || isCancelled) {
        onClose();
      }
    }
  }, [statusData, setOrders, toast, onClose]);

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

  // Cargar datos de orderRequest cuando se abre el modal
  useEffect(() => {
    if (!isOpen || !order.orderRequest?.id) {
      return;
    }

    const fetchOrderRequest = async () => {
      setIsLoadingOrderRequest(true);
      try {
        const orderRequestData = await getOrderRequestById(order.orderRequest!.id);
        setOrderRequestData(orderRequestData);
      } catch (error) {
        console.error('Error loading orderRequest:', error);
        toast({
          title: 'Error',
          description: 'No se pudo cargar la información del pedido original',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setIsLoadingOrderRequest(false);
      }
    };

    fetchOrderRequest();
  }, [isOpen, order.orderRequest?.id, toast]);

  // Para pedidos PENDING: obtener mejores descuentos para mostrar precios actualizados
  useEffect(() => {
    if (!isOpen || order.status !== Status.PENDING || !order.productItems?.length || !order.orderRequest?.clientId) {
      return;
    }

    const fetchDiscounts = async () => {
      setIsLoadingDiscounts(true);
      const discountPromises = order.productItems!.map(async (item) => {
        try {
          setDiscountData(prev => ({
            ...prev,
            [item.product.id]: { discount: null, isLoading: true }
          }));

          const bestDiscount = await getBestDiscount(item.product.id, order.orderRequest!.clientId!);
          
          setDiscountData(prev => ({
            ...prev,
            [item.product.id]: { discount: bestDiscount, isLoading: false }
          }));
        } catch (error) {
          console.error('Error getting best discount:', error);
          setDiscountData(prev => ({
            ...prev,
            [item.product.id]: { discount: null, isLoading: false }
          }));
        }
      });

      await Promise.all(discountPromises);
      setIsLoadingDiscounts(false);
    };

    fetchDiscounts();
  }, [isOpen, order.status, order.productItems, order.orderRequest?.clientId]);

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

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'lg' }} isCentered scrollBehavior="inside">
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
            Detalle de la Orden #{order.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Cliente', order.client?.name, FiUsers)}
                {detailField('Usuario', order.user?.name, FiUser)}
              </Stack>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Fecha de la orden', formatDate(order.date), FiCalendar)}
                {detailField('Estado', getStatusLabel(order.status), FiPackage)}
              </Stack>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField(
                  'Fecha de confirmación',
                  isValidDate(order.confirmedDate) ? formatDate(order.confirmedDate) : 'No confirmado',
                  FiCheckCircle,
                )}
                {detailField(
                  'Cajones utilizados',
                  order.crates && order.crates > 0 ? order.crates.toString() : 'No definido',
                  FiPackage,
                )}
              </Stack>

              {order.orderRequest && (
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing="1rem"
                  align={{ base: 'stretch', md: 'flex-start' }}
                >
                  {detailField('Pedido origen', `#${order.orderRequest.id}`, FiFileText)}
                </Stack>
              )}

              {detailField('Observaciones', order.observations || 'Sin observaciones', FiFileText)}

              <Divider />

              <Box w="100%">
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiPackage} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Productos ({order.productItems?.length || 0})
                  </Text>
                </HStack>
                {order.productItems && order.productItems.length > 0 ? (
                  <>
                    <VStack spacing="0.5rem" align="stretch" maxH="400px" overflowY="auto">
                      {order.productItems.map((item, index) => {
                        // Buscar la cantidad solicitada en el orderRequest original
                        const requestedItem = orderRequestData?.productItems?.find(
                          (reqItem) => reqItem.product.id === item.product.id,
                        );
                        const requestedQuantity = requestedItem?.quantity || 0;
                        const actualQuantity = item.quantity;
                        const weight = item.product?.unitType === UnitType.KILO ? actualQuantity * 1000 : null;

                        // Calcular total considerando descuentos actualizados para PENDING
                        const total = (() => {
                          if (order.status === Status.PENDING) {
                            const currentDiscount = discountData[item.product.id];
                            if (currentDiscount?.discount) {
                              const originalPrice = item.unitPrice / (1 - item.discount / 100);
                              const minQuantity = currentDiscount.discount.productQuantity;
                              if (requestedQuantity >= minQuantity) {
                                // Aplicar nuevo descuento
                                const effectivePrice = originalPrice * (1 - currentDiscount.discount.percentage / 100);
                                return actualQuantity * effectivePrice;
                              } else {
                                // Sin descuento si no se cumple cantidad mínima
                                return actualQuantity * originalPrice;
                              }
                            }
                          }
                          // Para otros estados: usar precio almacenado (ya con descuento aplicado)
                          return actualQuantity * item.unitPrice;
                        })();

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
                                  <Text fontSize="sm" fontWeight="medium" mb="0.25rem">
                                    {item.product?.name || '-'}
                                  </Text>
                                  <HStack spacing="0.5rem" align="center">
                                    {(() => {
                                      if (order.status === Status.PENDING) {
                                        // Para PENDING: usar descuentos actualizados
                                        const currentDiscount = discountData[item.product.id];
                                        
                                        if (currentDiscount?.isLoading) {
                                          return (
                                            <>
                                              <Text fontSize="xs" color={textColor}>
                                                ${(item.unitPrice / (1 - item.discount / 100)).toFixed(2)}
                                              </Text>
                                              <Spinner size="xs" />
                                              <Text fontSize="xs" color="gray.500">Cargando...</Text>
                                            </>
                                          );
                                        }
                                        
                                        if (currentDiscount?.discount) {
                                          const originalPrice = item.unitPrice / (1 - item.discount / 100);
                                          const discountedPrice = originalPrice * (1 - currentDiscount.discount.percentage / 100);
                                          const requestedQuantity = orderRequestData?.productItems?.find(pi => pi.product.id === item.product.id)?.quantity || item.quantity;
                                          const minQuantity = currentDiscount.discount.productQuantity;
                                          const discountApplied = requestedQuantity >= minQuantity;
                                          
                                          return (
                                            <>
                                              <Text 
                                                fontSize="xs" 
                                                color={textColor}
                                                textDecoration={discountApplied ? "line-through" : "none"}
                                              >
                                                ${originalPrice.toFixed(2)}
                                              </Text>
                                              <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                                ${discountedPrice.toFixed(2)}
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
                                                -{currentDiscount.discount.percentage}%
                                              </Box>
                                            </>
                                          );
                                        }
                                      }
                                      
                                      // Para otros estados: usar descuentos almacenados
                                      if (item.discount > 0) {
                                        return (
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
                                        );
                                      }
                                      
                                      return (
                                        <Text fontSize="xs" color={textColor}>
                                          ${(item.unitPrice / (1 - item.discount / 100)).toFixed(2)}
                                        </Text>
                                      );
                                    })()}
                                  </HStack>
                                </Box>
                              </Flex>

                              {/* Segunda fila desktop: Cantidad solicitada + Cantidad real + Peso + Subtotal */}
                              <Flex justify="space-around" align="center">
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. solicitada
                                  </Text>
                                  {isLoadingOrderRequest ? (
                                    <Spinner size="xs" />
                                  ) : (
                                    <Text
                                      fontSize="sm"
                                      fontWeight="semibold"
                                    >
                                      {requestedQuantity}
                                    </Text>
                                  )}
                                </VStack>

                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. real
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                  >
                                    {actualQuantity}
                                  </Text>
                                </VStack>

                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Peso (g)
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {item.product?.unitType === UnitType.KILO ? weight?.toFixed(0) || '-' : 'N/A'}
                                  </Text>
                                </VStack>

                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Subtotal
                                  </Text>
                                  {order.status === Status.PENDING && isLoadingDiscounts ? (
                                    <HStack spacing="0.25rem">
                                      <Spinner size="xs" />
                                      <Text fontSize="xs" color="gray.500">Calc...</Text>
                                    </HStack>
                                  ) : (
                                    <Text fontSize="md" fontWeight="bold">
                                      ${total.toFixed(2)}
                                    </Text>
                                  )}
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
                                  <Text fontSize="sm" fontWeight="medium" mb="0.25rem">
                                    {item.product?.name || '-'}
                                  </Text>
                                  <HStack spacing="0.5rem" align="center">
                                    {(() => {
                                      if (order.status === Status.PENDING) {
                                        // Para PENDING: usar descuentos actualizados
                                        const currentDiscount = discountData[item.product.id];
                                        
                                        if (currentDiscount?.isLoading) {
                                          return (
                                            <>
                                              <Text fontSize="xs" color={textColor}>
                                                ${(item.unitPrice / (1 - item.discount / 100)).toFixed(2)}
                                              </Text>
                                              <Spinner size="xs" />
                                              <Text fontSize="xs" color="gray.500">Cargando...</Text>
                                            </>
                                          );
                                        }
                                        
                                        if (currentDiscount?.discount) {
                                          const originalPrice = item.unitPrice / (1 - item.discount / 100);
                                          const discountedPrice = originalPrice * (1 - currentDiscount.discount.percentage / 100);
                                          const requestedQuantity = orderRequestData?.productItems?.find(pi => pi.product.id === item.product.id)?.quantity || item.quantity;
                                          const minQuantity = currentDiscount.discount.productQuantity;
                                          const discountApplied = requestedQuantity >= minQuantity;
                                          
                                          return (
                                            <>
                                              <Text 
                                                fontSize="xs" 
                                                color={textColor}
                                                textDecoration={discountApplied ? "line-through" : "none"}
                                              >
                                                ${originalPrice.toFixed(2)}
                                              </Text>
                                              <Text fontSize="sm" fontWeight="semibold" color="green.500">
                                                ${discountedPrice.toFixed(2)}
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
                                                -{currentDiscount.discount.percentage}%
                                              </Box>
                                            </>
                                          );
                                        }
                                      }
                                      
                                      // Para otros estados: usar descuentos almacenados
                                      if (item.discount > 0) {
                                        return (
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
                                        );
                                      }
                                      
                                      return (
                                        <Text fontSize="xs" color={textColor}>
                                          ${(item.unitPrice / (1 - item.discount / 100)).toFixed(2)}
                                        </Text>
                                      );
                                    })()}
                                  </HStack>
                                </Box>
                              </Flex>

                              {/* Fila media: Cantidad solicitada vs Cantidad real */}
                              <Flex justify="space-between" align="center" mb="0.75rem">
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. solicitada
                                  </Text>
                                  {isLoadingOrderRequest ? (
                                    <Spinner size="xs" />
                                  ) : (
                                    <Text
                                      fontSize="sm"
                                      fontWeight="semibold"
                                    >
                                      {requestedQuantity}
                                    </Text>
                                  )}
                                </VStack>
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Cant. real
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    fontWeight="semibold"
                                  >
                                    {actualQuantity}
                                  </Text>
                                </VStack>
                              </Flex>

                              {/* Fila inferior: Peso + Subtotal */}
                              <Flex justify="space-between" align="center">
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Peso (g)
                                  </Text>
                                  <Text fontSize="sm" fontWeight="semibold">
                                    {item.product?.unitType === UnitType.KILO ? weight?.toFixed(0) || '-' : 'N/A'}
                                  </Text>
                                </VStack>
                                <VStack spacing="0.25rem" align="center">
                                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                                    Subtotal
                                  </Text>
                                  {order.status === Status.PENDING && isLoadingDiscounts ? (
                                    <HStack spacing="0.25rem">
                                      <Spinner size="xs" />
                                      <Text fontSize="xs" color="gray.500">Calc...</Text>
                                    </HStack>
                                  ) : (
                                    <Text fontSize="md" fontWeight="bold">
                                      ${total.toFixed(2)}
                                    </Text>
                                  )}
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
                        {order.status === Status.PENDING && isLoadingDiscounts ? (
                          <HStack spacing="0.5rem">
                            <Spinner size="sm" />
                            <Text fontSize="md" fontWeight="semibold" color="gray.500">
                              Calculando...
                            </Text>
                          </HStack>
                        ) : (
                          <Text fontSize="md" fontWeight="semibold">
                            ${calculateTotal().toFixed(2)}
                          </Text>
                        )}
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
                      No hay productos en esta orden
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            {order.status === Status.PENDING ? (
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

                {/* Botón Cancelar - siempre disponible */}
                <Button
                  leftIcon={<FiX />}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  onClick={handleCancelOrder}
                  isLoading={statusLoading && actionType === 'cancel'}
                  disabled={statusLoading || !!statusProps}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 2, md: 2 }}
                >
                  Cancelar
                </Button>

                {/* Botón Confirmar - solo si ya está preparada */}
                {order.crates && order.crates > 0 && (
                  <Button
                    leftIcon={<FiCheckCircle />}
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    onClick={handleConfirmOrder}
                    isLoading={statusLoading && actionType === 'confirm'}
                    disabled={statusLoading || !!statusProps}
                    w={{ base: '100%', md: 'auto' }}
                    order={{ base: 3, md: 3 }}
                  >
                    Confirmar
                  </Button>
                )}

                {/* Botón Preparar - siempre disponible, al final */}
                <Button
                  leftIcon={<FiCheckCircle />}
                  colorScheme="blue"
                  variant="outline"
                  size="sm"
                  onClick={handlePrepareOrder}
                  disabled={statusLoading}
                  w={{ base: '100%', md: 'auto' }}
                  order={{ base: 4, md: 4 }}
                >
                  Preparar
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
                {/* Solo botón Cerrar para órdenes confirmadas/canceladas */}
                <Button variant="ghost" size="sm" onClick={onClose} w={{ base: '100%', md: 'auto' }}>
                  Cerrar
                </Button>
              </Stack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Prepare Modal */}
      {isPrepareOpen && (
        <OrderPrepare
          isOpen={isPrepareOpen}
          onClose={closePrepare}
          order={order}
          setOrders={setOrders}
          onOrderPrepared={handleOrderPrepared}
        />
      )}

      {/* Modal de confirmación para cancelar orden */}
      <AlertDialog isOpen={isStatusDialogOpen} leastDestructiveRef={cancelRef} onClose={closeStatusDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Cancelar orden
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas cancelar la orden #{order.id}?
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

      {/* Modal de confirmación para confirmar orden */}
      <AlertDialog isOpen={isConfirmDialogOpen} leastDestructiveRef={cancelRef} onClose={closeConfirmDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Confirmar orden
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas confirmar la orden #{order.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={cancelRef} onClick={closeConfirmDialog} variant="ghost" size="sm">
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={confirmOrderConfirmation}
              isLoading={statusLoading && actionType === 'confirm'}
              variant="outline"
              size="sm"
            >
              Sí, confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmación post-preparación */}
      <Modal isOpen={isConfirmPreparedOpen} onClose={handleContinueEditing} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="1.25rem" borderBottom="1px solid" borderColor={inputBorder} pb="0.75rem">
            <Text>¡Orden preparada exitosamente!</Text>
          </ModalHeader>

          <ModalBody py="1.5rem">
            <Text fontSize="0.95rem" color="gray.600" _dark={{ color: 'gray.400' }}>
              ¿Deseas confirmar la orden directamente?
            </Text>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor={inputBorder} pt="0.75rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleContinueEditing} size="sm">
                Más tarde
              </Button>
              <Button
                leftIcon={<FiCheckCircle />}
                colorScheme="green"
                variant="outline"
                onClick={handleConfirmPreparedOrder}
                size="sm"
                isLoading={statusLoading}
                loadingText="Confirmando..."
              >
                Confirmar orden
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
