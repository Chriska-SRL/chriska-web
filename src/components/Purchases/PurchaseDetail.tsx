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
  Stack,
  Flex,
  Image,
  Divider,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiInfo, FiUsers, FiCalendar, FiFileText, FiShoppingCart, FiEdit, FiCheckCircle, FiX } from 'react-icons/fi';
import { FaEdit } from 'react-icons/fa';
import { Purchase } from '@/entities/purchase';
import { PurchaseEdit } from './PurchaseEdit';
import { useChangePurchaseStatus } from '@/hooks/purchase';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Status, getStatusLabel, getStatusColor } from '@/enums/status.enum';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast, Badge } from '@chakra-ui/react';

type PurchaseDetailProps = {
  purchase: Purchase;
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
};

export const PurchaseDetail = ({ purchase, setPurchases }: PurchaseDetailProps) => {
  const canEditPurchases = useUserStore((s) => s.hasPermission(Permission.EDIT_PURCHASES));
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isConfirmDialogOpen, onOpen: openConfirmDialog, onClose: closeConfirmDialog } = useDisclosure();
  const { isOpen: isCancelDialogOpen, onOpen: openCancelDialog, onClose: closeCancelDialog } = useDisclosure();

  const [statusProps, setStatusProps] = useState<{ id: number; status: string }>();
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const confirmCancelRef = useRef<HTMLButtonElement>(null);
  const confirmConfirmRef = useRef<HTMLButtonElement>(null);

  const { data: statusData, isLoading: statusLoading, fieldError: statusError } = useChangePurchaseStatus(statusProps);

  const labelColor = useColorModeValue('black', 'white');
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const hoverBgIcon = useColorModeValue('gray.200', 'whiteAlpha.200');
  const iconColor = useColorModeValue('gray.500', 'gray.400');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleConfirmPurchase = useCallback(() => {
    if (statusLoading || statusProps) return;
    closeConfirmDialog();
    setActionType('confirm');
    setStatusProps({ id: purchase.id, status: Status.CONFIRMED });
  }, [statusLoading, statusProps, purchase.id, closeConfirmDialog]);

  const handleCancelPurchase = useCallback(() => {
    if (statusLoading || statusProps) return;
    closeCancelDialog();
    setActionType('cancel');
    setStatusProps({ id: purchase.id, status: Status.CANCELLED });
  }, [statusLoading, statusProps, purchase.id, closeCancelDialog]);

  useEffect(() => {
    if (statusData) {
      setPurchases((prev) => prev.map((p) => (p.id === purchase.id ? statusData : p)));
      const isConfirmed = statusData.status?.toLowerCase() === Status.CONFIRMED.toLowerCase();
      const isCancelled = statusData.status?.toLowerCase() === Status.CANCELLED.toLowerCase();

      toast({
        title: isConfirmed ? 'Factura confirmada' : isCancelled ? 'Factura cancelada' : 'Estado actualizado',
        description: isConfirmed
          ? 'La factura ha sido confirmada exitosamente.'
          : isCancelled
            ? 'La factura ha sido cancelada.'
            : 'El estado de la factura ha sido actualizado.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setStatusProps(undefined);
      setActionType(null);
      onClose();
    }
  }, [statusData, setPurchases, purchase.id, toast, onClose]);

  useEffect(() => {
    if (statusError) {
      toast({
        title: 'Error al cambiar estado',
        description: statusError.error || 'Error desconocido',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      setStatusProps(undefined);
      setActionType(null);
    }
  }, [statusError, toast]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
    } catch {
      return dateString;
    }
  };

  // Función para calcular el subtotal de un producto
  const calculateSubtotal = (quantity: number, unitPrice: number, discount: number) => {
    return quantity * unitPrice * (1 - discount / 100);
  };

  // Calcular el total de la factura
  const totalAmount =
    purchase.productItems?.reduce((total, item) => {
      return total + calculateSubtotal(item.quantity, item.unitPrice, item.discount);
    }, 0) || 0;

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
            Detalle de la factura #{purchase.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              {detailField('Proveedor', purchase.supplier?.name || 'Sin proveedor asignado', FiUsers)}
              {detailField('Fecha', formatDate(purchase.date), FiCalendar)}
              {detailField('Número de factura', purchase.invoiceNumber, FiFileText)}

              {/* Estado de la factura */}
              <Box w="100%">
                <HStack mb="0.5rem" spacing="0.5rem">
                  <Icon as={FiEdit} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Estado
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
                  <Badge colorScheme={getStatusColor(purchase.status)} variant="subtle">
                    {getStatusLabel(purchase.status)}
                  </Badge>
                </Box>
              </Box>

              {/* Sección de productos */}
              {purchase.productItems && purchase.productItems.length > 0 && (
                <Box w="100%">
                  <HStack mb="0.5rem" spacing="0.5rem">
                    <Icon as={FiShoppingCart} boxSize="1rem" color={iconColor} />
                    <Text color={labelColor} fontWeight="semibold">
                      Productos ({purchase.productItems.length})
                    </Text>
                  </HStack>

                  <VStack spacing="0.5rem" align="stretch">
                    {purchase.productItems.map((item, index) => {
                      const subtotal = calculateSubtotal(item.quantity, item.unitPrice, item.discount);
                      return (
                        <Box
                          key={index}
                          p={{ base: '1rem', md: '0.75rem' }}
                          border="1px solid"
                          borderColor={inputBorder}
                          borderRadius="md"
                          bg={inputBg}
                        >
                          {/* Desktop Layout - Dos filas */}
                          <Box display={{ base: 'none', md: 'block' }}>
                            {/* Primera fila: Imagen y Nombre */}
                            <Flex align="center" gap="1rem" mb="0.75rem">
                              {/* Imagen */}
                              <Image
                                src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                                alt={item.product?.name || 'Producto'}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                                flexShrink={0}
                              />

                              {/* Nombre */}
                              <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                  {item.product?.name || 'Producto sin nombre'}
                                </Text>
                              </Box>
                            </Flex>

                            {/* Segunda fila: Datos con space-around */}
                            <Flex align="center" justify="space-around">
                              {/* Quantity */}
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor} mb="0.25rem">
                                  Cantidad
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.quantity}
                                </Text>
                              </Box>

                              {/* Weight */}
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor} mb="0.25rem">
                                  Peso (g)
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.weight || 0}
                                </Text>
                              </Box>

                              {/* Unit Price */}
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor} mb="0.25rem">
                                  Precio
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  ${item.unitPrice.toFixed(2)}
                                </Text>
                              </Box>

                              {/* Discount */}
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor} mb="0.25rem">
                                  Descuento %
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.discount}%
                                </Text>
                              </Box>

                              {/* Subtotal */}
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor} mb="0.25rem">
                                  Subtotal
                                </Text>
                                <Text fontSize="md" fontWeight="bold">
                                  ${subtotal.toFixed(2)}
                                </Text>
                              </Box>
                            </Flex>
                          </Box>

                          {/* Mobile Layout - Tres filas */}
                          <Box display={{ base: 'block', md: 'none' }}>
                            {/* Primera fila: Image + Name */}
                            <Flex align="center" gap="0.75rem" mb="0.75rem">
                              <Image
                                src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                                alt={item.product?.name || 'Producto'}
                                boxSize="50px"
                                objectFit="cover"
                                borderRadius="md"
                                flexShrink={0}
                              />
                              <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                  {item.product?.name || 'Producto sin nombre'}
                                </Text>
                              </Box>
                            </Flex>

                            {/* Segunda fila: Cantidad y Peso */}
                            <Flex justify="space-between" align="center" mb="0.75rem">
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor}>
                                  Cantidad
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.quantity}
                                </Text>
                              </Box>
                              <Box textAlign="center">
                                <Text fontSize="xs" color={textColor}>
                                  Peso (g)
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {item.weight || 0}
                                </Text>
                              </Box>
                            </Flex>

                            {/* Tercera fila: Precio, Descuento y Subtotal */}
                            <VStack spacing="0.75rem" align="stretch">
                              <Flex justify="space-between" align="center">
                                <Box textAlign="center">
                                  <Text fontSize="xs" color={textColor}>
                                    Precio
                                  </Text>
                                  <Text fontSize="sm" fontWeight="medium">
                                    ${item.unitPrice.toFixed(2)}
                                  </Text>
                                </Box>
                                <Box textAlign="center">
                                  <Text fontSize="xs" color={textColor}>
                                    Descuento %
                                  </Text>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {item.discount}%
                                  </Text>
                                </Box>
                              </Flex>

                              <Box textAlign="center">
                                <Text fontSize="sm" color={textColor}>
                                  Subtotal
                                </Text>
                                <Text fontSize="md" fontWeight="bold">
                                  ${subtotal.toFixed(2)}
                                </Text>
                              </Box>
                            </VStack>
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
                        ${totalAmount.toFixed(2)}
                      </Text>
                    </HStack>
                  </Box>
                </Box>
              )}

              {/* Mensaje si no hay productos */}
              {(!purchase.productItems || purchase.productItems.length === 0) && (
                <Box w="100%">
                  <HStack mb="0.5rem" spacing="0.5rem">
                    <Icon as={FiShoppingCart} boxSize="1rem" color={iconColor} />
                    <Text color={labelColor} fontWeight="semibold">
                      Productos
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
                    <Text color={textColor}>No hay productos en esta factura</Text>
                  </Box>
                </Box>
              )}

              {/* Campo de observaciones al final */}
              {detailField('Observaciones', purchase.observations || '—', FiEdit)}
            </VStack>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            {purchase.status?.toLowerCase() === Status.PENDING.toLowerCase() ? (
              <Stack
                direction={{ base: 'column-reverse', md: 'row' }}
                spacing="0.5rem"
                w="100%"
                align="stretch"
                justify={{ base: 'stretch', md: 'flex-end' }}
              >
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cerrar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={openCancelDialog}
                  isLoading={statusLoading && actionType === 'cancel'}
                  variant="outline"
                  size="sm"
                  leftIcon={<FiX />}
                >
                  Cancelar
                </Button>
                <Button
                  colorScheme="green"
                  onClick={openConfirmDialog}
                  isLoading={statusLoading && actionType === 'confirm'}
                  variant="outline"
                  size="sm"
                  leftIcon={<FiCheckCircle />}
                >
                  Confirmar
                </Button>
                {canEditPurchases && purchase.status?.toLowerCase() === Status.PENDING.toLowerCase() && (
                  <Button
                    leftIcon={<FaEdit />}
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
              </Stack>
            ) : (
              <Stack
                direction={{ base: 'column-reverse', md: 'row' }}
                spacing="0.5rem"
                w="100%"
                align="stretch"
                justify={{ base: 'stretch', md: 'flex-end' }}
              >
                <Button variant="ghost" size="sm" onClick={onClose}>
                  Cerrar
                </Button>
              </Stack>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {isEditOpen && (
        <PurchaseEdit isOpen={isEditOpen} onClose={closeEdit} purchase={purchase} setPurchases={setPurchases} />
      )}

      {/* Modal de confirmación para confirmar factura */}
      <AlertDialog
        isOpen={isConfirmDialogOpen}
        leastDestructiveRef={confirmConfirmRef}
        onClose={closeConfirmDialog}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Confirmar factura
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas confirmar la factura #{purchase.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={confirmConfirmRef} onClick={closeConfirmDialog} variant="ghost" size="sm">
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleConfirmPurchase}
              isLoading={statusLoading && actionType === 'confirm'}
              variant="outline"
              size="sm"
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de confirmación para cancelar factura */}
      <AlertDialog
        isOpen={isCancelDialogOpen}
        leastDestructiveRef={confirmCancelRef}
        onClose={closeCancelDialog}
        isCentered
      >
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Cancelar factura
          </AlertDialogHeader>

          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas cancelar la factura #{purchase.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>

          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={confirmCancelRef} onClick={closeCancelDialog} variant="ghost" size="sm">
              No cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={handleCancelPurchase}
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
