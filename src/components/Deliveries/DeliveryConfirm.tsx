'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  useToast,
  VStack,
  Box,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiDollarSign, FiCreditCard, FiPackage } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Delivery } from '@/entities/delivery';
import { useChangeDeliveryStatus } from '@/hooks/delivery';
import { Status } from '@/enums/status.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type DeliveryConfirmProps = {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery | null;
  onDeliveryUpdated: (delivery: Delivery) => void;
};

type FormValues = {
  amount: number;
  paymentMethod: 'efectivo' | 'cheque' | '';
  returnedCrates: number;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const DeliveryConfirmForm = ({
  isOpen,
  onClose,
  delivery,
  onDeliveryUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
  onDeliveryUpdated: (delivery: Delivery) => void;
}) => {
  const toast = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const [statusProps, setStatusProps] = useState<{
    id: number;
    status: string;
    additionalData?: {
      amount?: number;
      paymentMethod?: string | null;
      crates?: number;
    };
  }>();
  const { data: statusData, isLoading, fieldError: statusError } = useChangeDeliveryStatus(statusProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  // Manejar el resultado de la confirmación
  useEffect(() => {
    if (statusData) {
      toast({
        title: 'Entrega confirmada',
        description: 'La entrega ha sido confirmada exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setStatusProps(undefined);
      onDeliveryUpdated(statusData);
      handleClose();
    }
  }, [statusData, toast, onDeliveryUpdated]);

  // Manejar errores
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

  const handleClose = () => {
    setShowConfirmDialog(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    if (isLoading) return; // No permitir cerrar mientras está cargando
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  const validateForm = (values: FormValues) => {
    const errors: Record<string, string> = {};

    // Amount is optional, but if provided should be >= 0
    if (values.amount < 0) {
      errors.amount = 'El monto no puede ser negativo';
    }

    // Payment method is required only if amount > 0
    if (values.amount > 0 && !values.paymentMethod) {
      errors.paymentMethod = 'Debe seleccionar un método de pago';
    }

    if (values.returnedCrates < 0) {
      errors.returnedCrates = 'Los cajones devueltos no pueden ser negativos';
    }

    return errors;
  };

  const handleSubmit = (values: FormValues) => {
    // Prepare additional data
    const additionalData: { amount?: number; paymentMethod?: string | null; crates?: number } = {};

    // Always include amount (can be 0)
    additionalData.amount = values.amount;

    // Include payment method - null if amount is 0, otherwise map the value
    if (values.amount === 0) {
      additionalData.paymentMethod = null;
    } else {
      additionalData.paymentMethod = values.paymentMethod === 'efectivo' ? 'Cash' : 'Check';
    }

    // Always include crates
    additionalData.crates = values.returnedCrates;

    // Confirmar la entrega con datos adicionales
    setStatusProps({
      id: delivery.id,
      status: Status.CONFIRMED,
      additionalData,
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'md' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
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
            Confirmar entrega #{delivery.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                amount: 0,
                paymentMethod: '' as 'efectivo' | 'cheque' | '',
                returnedCrates: 0,
              }}
              validate={validateForm}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty, resetForm, values, setFieldValue }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                // Handle payment method reset when amount changes to 0
                useEffect(() => {
                  if (values.amount === 0) {
                    setFieldValue('paymentMethod', '');
                  }
                }, [values.amount, setFieldValue]);

                return (
                  <form id="delivery-confirm-form" onSubmit={handleSubmit}>
                    <Box>
                      <VStack spacing="1rem" align="stretch">
                        {/* Monto */}
                        <Field name="amount">
                          {({ meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiDollarSign} boxSize="1rem" />
                                  <Text>Monto recibido </Text>
                                </HStack>
                              </FormLabel>
                              <NumberInput
                                value={values.amount}
                                onChange={(_, valueAsNumber) => {
                                  const newValue = isNaN(valueAsNumber) ? 0 : valueAsNumber;
                                  setFieldValue('amount', newValue);
                                }}
                                min={0}
                                precision={2}
                                step={0.01}
                              >
                                <NumberInputField
                                  placeholder="Ingrese el monto recibido (0 por defecto)"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        {/* Método de pago */}
                        <Field name="paymentMethod">
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiCreditCard} boxSize="1rem" />
                                  <Text>Método de pago</Text>
                                </HStack>
                              </FormLabel>
                              <Select
                                {...field}
                                placeholder={values.amount === 0 ? 'No requerido' : 'Seleccione el método de pago'}
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading || values.amount === 0}
                              >
                                <option value="efectivo">Efectivo</option>
                                <option value="cheque">Cheque</option>
                              </Select>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        {/* Cajones devueltos */}
                        <Field name="returnedCrates">
                          {({ meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiPackage} boxSize="1rem" />
                                  <Text>Cajones devueltos</Text>
                                </HStack>
                              </FormLabel>
                              <NumberInput
                                value={values.returnedCrates}
                                onChange={(_, valueAsNumber) => {
                                  const newValue = isNaN(valueAsNumber) ? 0 : valueAsNumber;
                                  setFieldValue('returnedCrates', newValue);
                                }}
                                min={0}
                              >
                                <NumberInputField
                                  placeholder="Cantidad de cajones devueltos"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </VStack>
                    </Box>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm" leftIcon={<FaTimes />}>
                Cancelar
              </Button>
              <Button
                form="delivery-confirm-form"
                type="submit"
                colorScheme="green"
                variant="outline"
                isLoading={isLoading}
                loadingText="Confirmando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Confirmar entrega
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};

// Componente principal que controla cuándo renderizar el formulario
export const DeliveryConfirm = ({ isOpen, onClose, delivery, onDeliveryUpdated }: DeliveryConfirmProps) => {
  // Solo renderizar el formulario cuando el modal está abierto y hay delivery
  if (!isOpen || !delivery) return null;

  return (
    <DeliveryConfirmForm isOpen={isOpen} onClose={onClose} delivery={delivery} onDeliveryUpdated={onDeliveryUpdated} />
  );
};
