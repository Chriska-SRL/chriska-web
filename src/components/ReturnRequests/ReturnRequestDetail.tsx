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
  Flex,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Image,
  Spinner,
} from '@chakra-ui/react';
import { ReturnRequest } from '@/entities/returnRequest';
import { useGetDeliveryById } from '@/hooks/delivery';
import {
  FiInfo,
  FiEdit,
  FiCheckCircle,
  FiUsers,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPackage,
  FiX,
  FiTruck,
} from 'react-icons/fi';
import { ReturnRequestEdit } from './ReturnRequestEdit';
import { useChangeReturnRequestStatus } from '@/hooks/returnRequest';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { getStatusLabel, getStatusColor, Status } from '@/enums/status.enum';

type ReturnRequestDetailProps = {
  returnRequest: ReturnRequest;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  returnRequests: ReturnRequest[];
};

export const ReturnRequestDetail = ({ returnRequest, setReturnRequests, returnRequests }: ReturnRequestDetailProps) => {
  const canEditReturnRequests = useUserStore((s) => s.hasPermission(Permission.EDIT_ORDER_REQUESTS));
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: openEdit, onClose: closeEdit } = useDisclosure();
  const { isOpen: isConfirmDialogOpen, onOpen: openConfirmDialog, onClose: closeConfirmDialog } = useDisclosure();
  const { isOpen: isCancelDialogOpen, onOpen: openCancelDialog, onClose: closeCancelDialog } = useDisclosure();
  const { isOpen: isConfirmEditModal, onOpen: openConfirmEditModal, onClose: closeConfirmEditModal } = useDisclosure();
  const [statusProps, setStatusProps] = useState<{ id: number; status: string }>();
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | null>(null);
  const [updatedReturnRequestData, setUpdatedReturnRequestData] = useState<ReturnRequest | null>(null);
  const {
    data: statusData,
    isLoading: statusLoading,
    fieldError: statusError,
  } = useChangeReturnRequestStatus(statusProps);
  const { data: deliveryData, isLoading: isLoadingDelivery } = useGetDeliveryById(returnRequest.delivery?.id);
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

  // Function to get original delivered quantity for a product
  const getOriginalDeliveredQuantity = (productId: number) => {
    if (!deliveryData?.productItems) return 0;
    const deliveredItem = deliveryData.productItems.find((item) => item.product.id === productId);
    return deliveredItem?.quantity || 0;
  };

  const detailField = (
    label: string,
    value: string | number | null | undefined | React.ReactNode,
    icon?: any,
    textColor?: string,
  ) => (
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

  const handleConfirmStatus = useCallback(() => {
    if (actionType === 'confirm') {
      setStatusProps({ id: returnRequest.id, status: Status.CONFIRMED });
      closeConfirmDialog();
    } else if (actionType === 'cancel') {
      setStatusProps({ id: returnRequest.id, status: Status.CANCELLED });
      closeCancelDialog();
    }
    // Don't reset actionType immediately - let useEffect handle it
  }, [returnRequest.id, actionType, closeConfirmDialog, closeCancelDialog]);

  // Handler para cuando se actualiza una devolución (igual al patrón de OrderDetail)
  const handleReturnRequestUpdated = useCallback(
    (updatedReturnRequest: ReturnRequest) => {
      setUpdatedReturnRequestData(updatedReturnRequest);
      openConfirmEditModal();
    },
    [openConfirmEditModal],
  );

  const handleConfirmUpdatedReturnRequest = useCallback(() => {
    if (updatedReturnRequestData) {
      setStatusProps({ id: updatedReturnRequestData.id, status: Status.CONFIRMED });
    }
    // No cerrar el modal inmediatamente - se cerrará cuando la confirmación sea exitosa
  }, [updatedReturnRequestData]);

  const handleContinueEditing = useCallback(() => {
    closeConfirmEditModal();
  }, [closeConfirmEditModal]);

  const openConfirmStatusDialog = (type: 'confirm' | 'cancel') => {
    setActionType(type);
    if (type === 'confirm') {
      openConfirmDialog();
    } else {
      openCancelDialog();
    }
  };

  // Handle status change success
  useEffect(() => {
    if (statusData && statusProps) {
      const updatedReturnRequests = returnRequests.map((r) => (r.id === statusData.id ? statusData : r));
      setReturnRequests(updatedReturnRequests);

      const getStatusMessage = (status: string) => {
        switch (status.toLowerCase()) {
          case 'confirmed':
            return 'La devolución ha sido confirmada exitosamente';
          case 'cancelled':
            return 'La devolución ha sido cancelada';
          default:
            return `La devolución ha sido actualizada`;
        }
      };

      toast({
        title: 'Estado actualizado',
        description: getStatusMessage(statusData.status),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setStatusProps(undefined);
      setActionType(null);

      // Si estamos confirmando después de editar, también cerrar ese modal
      if (isConfirmEditModal) {
        closeConfirmEditModal();
        setUpdatedReturnRequestData(null);
      }
    }
  }, [statusData, statusProps, returnRequests, setReturnRequests, toast, isConfirmEditModal, closeConfirmEditModal]);

  // Handle status change error
  useEffect(() => {
    if (statusError && statusProps) {
      toast({
        title: 'Error al cambiar estado',
        description: statusError.error || 'Ha ocurrido un error inesperado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setStatusProps(undefined);
      setActionType(null);
    }
  }, [statusError, statusProps, toast]);

  const canConfirm = returnRequest.status?.toLowerCase() === Status.PENDING.toLowerCase();
  const canCancel = [Status.PENDING.toLowerCase(), Status.CONFIRMED.toLowerCase()].includes(
    returnRequest.status?.toLowerCase(),
  );
  const canEdit = returnRequest.status?.toLowerCase() === Status.PENDING.toLowerCase();

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
            Detalle de la Devolución #{returnRequest.id}
          </ModalHeader>
          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <VStack spacing="1rem" align="stretch">
              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Cliente', returnRequest.delivery?.client?.name, FiUsers)}
                {detailField('Usuario', returnRequest.user?.name, FiUser)}
              </Stack>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Fecha de creación', formatDate(returnRequest.date), FiCalendar)}
                {detailField(
                  'Fecha confirmación',
                  returnRequest.confirmedDate ? formatDate(returnRequest.confirmedDate) : '-',
                  FiCheckCircle,
                )}
              </Stack>

              <Stack
                direction={{ base: 'column', md: 'row' }}
                spacing="1rem"
                align={{ base: 'stretch', md: 'flex-start' }}
              >
                {detailField('Entrega', returnRequest.delivery ? `#${returnRequest.delivery.id}` : '-', FiTruck)}
                {detailField(
                  'Estado',
                  <Badge
                    colorScheme={getStatusColor(returnRequest.status)}
                    fontSize="0.75rem"
                    p="0.25rem 0.75rem"
                    borderRadius="0.375rem"
                  >
                    {getStatusLabel(returnRequest.status)}
                  </Badge>,
                  FiPackage,
                )}
              </Stack>

              {returnRequest.observations && (
                <Box w="100%">{detailField('Observaciones', returnRequest.observations, FiFileText)}</Box>
              )}

              <Divider />

              <Box w="100%">
                <HStack mb="1rem" spacing="0.5rem">
                  <Icon as={FiPackage} boxSize="1rem" color={iconColor} />
                  <Text color={labelColor} fontWeight="semibold">
                    Productos devueltos
                  </Text>
                </HStack>

                <VStack spacing="0.75rem" align="stretch">
                  {returnRequest.productItems?.map((item, index) => (
                    <Box
                      key={index}
                      p="1rem"
                      border="1px solid"
                      borderColor={inputBorder}
                      borderRadius="0.5rem"
                      bg={inputBg}
                    >
                      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: '0.75rem', md: '1rem' }}>
                        {/* Imagen y nombre del producto */}
                        <Flex align="center" gap="0.75rem" flex={{ base: 'auto', md: '1' }}>
                          <Image
                            src={
                              item.product?.imageUrl || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
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
                              <Text fontSize="xs" color={textColor} fontWeight="medium">
                                Código:
                              </Text>
                              <Text fontSize="sm" fontWeight="semibold">
                                {item.product?.internalCode || '-'}
                              </Text>
                            </HStack>
                          </Box>
                        </Flex>

                        {/* Desktop: Cantidad en columna */}
                        <Flex display={{ base: 'none', md: 'flex' }} align="center" gap="1.5rem">
                          <VStack spacing="0.25rem" align="center" minW="80px">
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              Cant. entregada
                            </Text>
                            {isLoadingDelivery ? (
                              <Spinner size="sm" />
                            ) : (
                              <Text fontSize="sm" fontWeight="semibold">
                                {getOriginalDeliveredQuantity(item.product.id) || '-'}
                              </Text>
                            )}
                          </VStack>
                          <VStack spacing="0.25rem" align="center" minW="80px">
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              Cant. devuelta
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">
                              {item.quantity}
                            </Text>
                          </VStack>
                        </Flex>

                        {/* Mobile: Cantidad en fila horizontal */}
                        <VStack display={{ base: 'flex', md: 'none' }} spacing="0.25rem" align="start">
                          <HStack spacing="0.5rem" align="center">
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              Cant. entregada
                            </Text>
                            {isLoadingDelivery ? (
                              <Spinner size="xs" />
                            ) : (
                              <Text fontSize="sm" fontWeight="semibold">
                                {getOriginalDeliveredQuantity(item.product.id) || '-'}
                              </Text>
                            )}
                          </HStack>
                          <HStack spacing="0.5rem" align="center">
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              Cant. devuelta
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">
                              {item.quantity}
                            </Text>
                          </HStack>
                        </VStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            {returnRequest.status?.toLowerCase() === Status.PENDING.toLowerCase() ? (
              <Stack
                direction={{ base: 'column-reverse', md: 'row' }}
                spacing="0.5rem"
                w="100%"
                align="stretch"
                justify={{ base: 'stretch', md: 'flex-end' }}
              >
                <Button variant="ghost" size="sm" onClick={onClose} w={{ base: '100%', md: 'auto' }}>
                  Cerrar
                </Button>

                {canEditReturnRequests && canCancel && (
                  <Button
                    leftIcon={<FiX />}
                    colorScheme="red"
                    variant="outline"
                    size="sm"
                    onClick={() => openConfirmStatusDialog('cancel')}
                    isLoading={statusLoading && actionType === 'cancel'}
                    disabled={statusLoading}
                    w={{ base: '100%', md: 'auto' }}
                  >
                    Cancelar
                  </Button>
                )}

                {canEditReturnRequests && canConfirm && (
                  <Button
                    leftIcon={<FiCheckCircle />}
                    colorScheme="green"
                    variant="outline"
                    size="sm"
                    onClick={() => openConfirmStatusDialog('confirm')}
                    isLoading={statusLoading && actionType === 'confirm'}
                    disabled={statusLoading}
                    w={{ base: '100%', md: 'auto' }}
                  >
                    Confirmar
                  </Button>
                )}

                {canEditReturnRequests && canEdit && (
                  <Button
                    leftIcon={<FiEdit />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openEdit();
                      onClose();
                    }}
                    disabled={statusLoading}
                    w={{ base: '100%', md: 'auto' }}
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
                <Button variant="ghost" size="sm" onClick={onClose} w={{ base: '100%', md: 'auto' }}>
                  Cerrar
                </Button>

                {canEditReturnRequests && canEdit && (
                  <Button
                    leftIcon={<FiEdit />}
                    colorScheme="blue"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      openEdit();
                      onClose();
                    }}
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

      {/* Confirm Dialog */}
      <AlertDialog isOpen={isConfirmDialogOpen} leastDestructiveRef={cancelRef} onClose={closeConfirmDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Confirmar devolución
          </AlertDialogHeader>
          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas confirmar la devolución #{returnRequest.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>
          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={cancelRef} onClick={closeConfirmDialog} variant="ghost" size="sm">
              Cancelar
            </Button>
            <Button
              colorScheme="green"
              onClick={handleConfirmStatus}
              isLoading={statusLoading && actionType === 'confirm'}
              variant="outline"
              size="sm"
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog isOpen={isCancelDialogOpen} leastDestructiveRef={cancelRef} onClose={closeCancelDialog} isCentered>
        <AlertDialogOverlay />
        <AlertDialogContent mx="1rem">
          <AlertDialogHeader fontSize="1.125rem" fontWeight="semibold" pb="0.75rem">
            Cancelar devolución
          </AlertDialogHeader>
          <AlertDialogBody fontSize="0.875rem" pb="1.5rem">
            ¿Estás seguro de que deseas cancelar la devolución #{returnRequest.id}?
            <br />
            Esta acción no se puede deshacer.
          </AlertDialogBody>
          <AlertDialogFooter pt="0" justifyContent="flex-end" gap="0.5rem">
            <Button ref={cancelRef} onClick={closeCancelDialog} variant="ghost" size="sm">
              No cancelar
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmStatus}
              isLoading={statusLoading && actionType === 'cancel'}
              variant="outline"
              size="sm"
            >
              Sí, cancelar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Modal */}
      {isEditOpen && (
        <ReturnRequestEdit
          returnRequest={returnRequest}
          isOpen={isEditOpen}
          onClose={closeEdit}
          setReturnRequests={setReturnRequests}
          onReturnRequestUpdated={handleReturnRequestUpdated}
        />
      )}

      {/* Modal de confirmación post-actualización */}
      <Modal isOpen={isConfirmEditModal} onClose={handleContinueEditing} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="1.25rem" borderBottom="1px solid" borderColor={inputBorder} pb="0.75rem">
            <Text>Devolución actualizada exitosamente</Text>
          </ModalHeader>

          <ModalBody py="1.5rem">
            <Text fontSize="0.95rem" color="gray.600" _dark={{ color: 'gray.400' }}>
              ¿Deseas confirmar la devolución directamente?
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
                onClick={handleConfirmUpdatedReturnRequest}
                size="sm"
                isLoading={statusLoading}
                loadingText="Confirmando..."
              >
                Confirmar devolución
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
