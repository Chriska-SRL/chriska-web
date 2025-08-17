'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  VStack,
  HStack,
  Divider,
  Box,
  IconButton,
  useColorModeValue,
  Icon,
  Image,
  Flex,
} from '@chakra-ui/react';
import { OrderRequest } from '@/entities/orderRequest';
import {
  FiEye,
  FiEdit,
  FiCheckCircle,
  FiUsers,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPackage,
  FiDollarSign,
} from 'react-icons/fi';
import { OrderRequestEdit } from './OrderRequestEdit';
import { GenericDelete } from '@/components/shared/GenericDelete';
import { useDeleteOrderRequest, useChangeOrderRequestStatus } from '@/hooks/orderRequest';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
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
  const canDeleteOrderRequests = useUserStore((s) => s.hasPermission(Permission.DELETE_ORDER_REQUESTS));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const [statusProps, setStatusProps] = useState<{ id: number; status: string }>();
  const {
    data: statusData,
    isLoading: statusLoading,
    fieldError: statusError,
  } = useChangeOrderRequestStatus(statusProps);
  const toast = useToast();

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
        return total + item.quantity * item.unitPrice;
      }, 0) || 0
    );
  };

  const calculateDiscount = () => {
    return (
      orderRequest.productItems?.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice * item.discount) / 100;
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

  const handleConfirmOrder = () => {
    setStatusProps({ id: orderRequest.id, status: Status.CONFIRMED });
  };

  useEffect(() => {
    if (statusData) {
      setOrderRequests((prev) => prev.map((or) => (or.id === orderRequest.id ? statusData : or)));
      toast({
        title: 'Pedido confirmado',
        description: 'El pedido ha sido confirmado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setStatusProps(undefined);
    }
  }, [statusData, setOrderRequests, toast, orderRequest.id]);

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
          <ModalCloseButton />
          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <HStack spacing="1rem" align="flex-start">
                {detailField('Cliente', orderRequest.client?.name, FiUsers)}
                {detailField('Usuario', orderRequest.user?.name, FiUser)}
              </HStack>

              <HStack spacing="1rem" align="flex-start">
                {detailField('Fecha del pedido', formatDate(orderRequest.date), FiCalendar)}
                {detailField('Estado', getStatusLabel(orderRequest.status), FiPackage)}
              </HStack>

              <HStack spacing="1rem" align="flex-start">
                {detailField(
                  'Fecha de confirmación',
                  orderRequest.confirmedDate ? formatDate(orderRequest.confirmedDate) : 'No confirmado',
                  FiCalendar,
                )}
                {detailField('Total', `$${calculateTotal().toFixed(2)}`, FiDollarSign)}
              </HStack>

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
                      const subtotal = item.quantity * item.unitPrice;
                      const discount = subtotal * (item.discount / 100);
                      const total = subtotal - discount;

                      return (
                        <Box
                          key={index}
                          p="0.75rem 1.5rem"
                          border="1px solid"
                          borderColor={inputBorder}
                          borderRadius="md"
                          bg={inputBg}
                        >
                          <Flex align="center" gap="1rem">
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
                              <Text fontSize="xs" color={textColor}>
                                Precio: ${item.unitPrice.toFixed(2)}
                              </Text>
                            </Box>
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
                                Peso (kg)
                              </Text>
                              <Text fontSize="sm" fontWeight="medium">
                                {item.weight}
                              </Text>
                            </VStack>
                            {item.discount > 0 && (
                              <VStack spacing="0.25rem" align="center" minW="80px">
                                <Text fontSize="xs" color={textColor}>
                                  Descuento
                                </Text>
                                <Text fontSize="sm" fontWeight="medium" color="orange.500">
                                  {item.discount}%
                                </Text>
                              </VStack>
                            )}
                            <VStack spacing="0.25rem" align="center" minW="80px">
                              <Text fontSize="xs" color={textColor}>
                                Subtotal
                              </Text>
                              <Text fontSize="sm" fontWeight="bold">
                                ${total.toFixed(2)}
                              </Text>
                            </VStack>
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
            <HStack spacing="0.5rem">
              {orderRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() && (
                <>
                  <Button
                    leftIcon={<FiCheckCircle />}
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    onClick={handleConfirmOrder}
                    isLoading={statusLoading}
                  >
                    Confirmar
                  </Button>
                  {canDeleteOrderRequests && (
                    <GenericDelete
                      item={{ id: orderRequest.id, name: `Pedido #${orderRequest.id}` }}
                      setItems={setOrderRequests}
                      useDeleteHook={useDeleteOrderRequest}
                      onDeleted={onClose}
                      size="sm"
                      variant="outline"
                    />
                  )}
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
                    >
                      Editar
                    </Button>
                  )}
                </>
              )}
            </HStack>
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
    </>
  );
};
