'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  useToast,
  VStack,
  useColorModeValue,
  FormErrorMessage,
  Input,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { ReturnRequest } from '@/entities/returnRequest';
import { useAddReturnRequest } from '@/hooks/returnRequest';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ReturnRequestAddProps = {
  isLoading: boolean;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  preselectedDeliveryId?: number;
  forceOpen?: boolean;
  onReturnRequestCreated?: (returnRequest: ReturnRequest) => void;
};

type ReturnRequestAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
  preselectedDeliveryId?: number;
  onReturnRequestCreated?: (returnRequest: ReturnRequest) => void;
};

const ReturnRequestAddModal = ({
  isOpen,
  onClose,
  setReturnRequests,
  preselectedDeliveryId,
  onReturnRequestCreated,
}: ReturnRequestAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<{ dirty: boolean; resetForm: () => void } | null>(null);

  const { data, isLoading, fieldError, mutate } = useAddReturnRequest();

  // Handle successful creation
  useEffect(() => {
    if (data) {
      setReturnRequests((prev) => [...prev, data]);
      if (formikInstance) {
        formikInstance.resetForm();
      }
      onClose();
      // Llamar al callback para abrir el edit
      if (onReturnRequestCreated) {
        onReturnRequestCreated(data);
      }
      toast({
        title: 'Devolución creada',
        description: 'La devolución ha sido creada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [data, setReturnRequests, onClose, toast, formikInstance]);

  // Handle errors
  useEffect(() => {
    if (fieldError) {
      const errorMessage = fieldError.error || 'Ha ocurrido un error inesperado';
      toast({
        title: 'Error al crear devolución',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [fieldError, toast]);

  const handleClose = () => {
    if (formikInstance?.dirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    if (formikInstance) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleSubmit = async (values: { deliveryId: string }) => {
    const formData = {
      deliveryId: parseInt(values.deliveryId),
    };

    await mutate(formData);
  };

  const initialValues = {
    deliveryId: preselectedDeliveryId ? preselectedDeliveryId.toString() : '',
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'sm' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
        scrollBehavior="inside"
      >
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
            Nueva devolución
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validate={(values) => {
                const errors: any = {};

                if (!values.deliveryId) {
                  errors.deliveryId = 'El ID de la entrega es requerido';
                } else if (isNaN(Number(values.deliveryId))) {
                  errors.deliveryId = 'El ID debe ser un número válido';
                } else if (Number(values.deliveryId) <= 0) {
                  errors.deliveryId = 'El ID debe ser un número positivo';
                } else if (!Number.isInteger(Number(values.deliveryId))) {
                  errors.deliveryId = 'El ID debe ser un número entero';
                }

                return errors;
              }}
              validateOnChange={true}
              validateOnBlur={false}
            >
              {(formik) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty: formik.dirty, resetForm: formik.resetForm });
                }, [formik.dirty, formik.resetForm]);

                return (
                  <>
                    <form id="return-request-form" onSubmit={formik.handleSubmit}>
                      <VStack spacing="1rem" align="stretch">
                        <FormControl isInvalid={!!formik.errors.deliveryId && formik.submitCount > 0}>
                          <FormLabel fontWeight="semibold">
                            ID de la entrega{' '}
                            <Text color="red.500" as="span">
                              *
                            </Text>
                          </FormLabel>
                          <Input
                            name="deliveryId"
                            placeholder="Ingresa el ID de la entrega"
                            value={formik.values.deliveryId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            bg={inputBg}
                            borderColor={inputBorder}
                            type="number"
                            min="1"
                          />
                          <FormErrorMessage>{formik.errors.deliveryId}</FormErrorMessage>
                        </FormControl>
                      </VStack>
                    </form>
                  </>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleOverlayClick} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="return-request-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaCheck />}
                isLoading={isLoading}
                loadingText="Creando..."
                size="sm"
              >
                Crear devolución
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  );
};

export const ReturnRequestAdd = ({
  isLoading,
  setReturnRequests,
  preselectedDeliveryId,
  forceOpen,
  onReturnRequestCreated,
}: ReturnRequestAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasPermission = useUserStore((state) => state.hasPermission);

  // Abrir automáticamente si forceOpen es true
  useEffect(() => {
    if (forceOpen) {
      onOpen();
    }
  }, [forceOpen, onOpen]);

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!hasPermission(Permission.CREATE_RETURN_REQUESTS)) {
    return null;
  }

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoading}
      >
        Nuevo
      </Button>

      {isOpen && (
        <ReturnRequestAddModal
          isOpen={isOpen}
          onClose={onClose}
          setReturnRequests={setReturnRequests}
          preselectedDeliveryId={preselectedDeliveryId}
          onReturnRequestCreated={onReturnRequestCreated}
        />
      )}
    </>
  );
};
