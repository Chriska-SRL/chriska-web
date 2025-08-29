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
  Input,
  useToast,
  VStack,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  Select,
  NumberInput,
  NumberInputField,
  Textarea,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { FiUsers, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Receipt } from '@/entities/receipt';
import { useUpdateReceipt } from '@/hooks/receipt';
import { useGetClients } from '@/hooks/client';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { PaymentMethodOptions } from '@/enums/paymentMethod.enum';

type ReceiptEditProps = {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt;
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
};

export const ReceiptEdit = ({ isOpen, onClose, receipt, setReceipts }: ReceiptEditProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [receiptProps, setReceiptProps] = useState<Partial<Receipt>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useUpdateReceipt(receiptProps);
  const { data: clients } = useGetClients(1, 100);

  const handleClose = () => {
    setReceiptProps(undefined);
    setShowConfirmDialog(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (data) {
      toast({
        title: 'Recibo actualizado',
        description: 'El recibo ha sido actualizado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setReceiptProps(undefined);
      setReceipts((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      onClose();
    }
  }, [data, setReceipts, toast, onClose]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: 'Error',
        description: fieldError.error,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } else if (error) {
      toast({
        title: 'Error inesperado',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, fieldError, toast]);

  const handleSubmit = (values: any) => {
    const updatedReceipt = {
      ...values,
      id: receipt.id,
      clientId: Number(values.clientId),
      amount: Number(values.amount),
    };
    setReceiptProps(updatedReceipt);
  };

  const validateForm = (values: any) => {
    const errors: any = {};

    const clientIdError = validateEmpty(values.clientId);
    if (clientIdError) errors.clientId = 'Debe seleccionar un cliente';

    const amountError = validateEmpty(values.amount);
    if (amountError) errors.amount = amountError;
    else if (Number(values.amount) <= 0) errors.amount = 'El monto debe ser mayor a 0';

    const paymentMethodError = validateEmpty(values.paymentMethod);
    if (paymentMethodError) errors.paymentMethod = 'Debe seleccionar un método de pago';

    const dateError = validateEmpty(values.date);
    if (dateError) errors.date = dateError;

    return errors;
  };

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'md' }}
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
            Editar recibo #{receipt.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                clientId: receipt.client?.id?.toString() || '',
                amount: receipt.amount?.toString() || '',
                paymentMethod: receipt.paymentMethod || '',
                date: formatDateForInput(receipt.date),
                notes: receipt.notes || '',
              }}
              onSubmit={handleSubmit}
              validate={validateForm}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="receipt-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field name="clientId">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.clientId && !!errors.clientId}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiUsers} boxSize="1rem" />
                                <Text>Cliente</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar cliente"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            >
                              {clients?.map((client) => (
                                <option key={client.id} value={client.id}>
                                  {client.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.clientId}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="date">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.date && !!errors.date}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiCalendar} boxSize="1rem" />
                                <Text>Fecha</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              type="date"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.date}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="amount">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.amount && !!errors.amount}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiDollarSign} boxSize="1rem" />
                                <Text>Monto</Text>
                              </HStack>
                            </FormLabel>
                            <NumberInput
                              min={0}
                              precision={2}
                              value={field.value}
                              onChange={(valueString) =>
                                field.onChange({ target: { name: field.name, value: valueString } })
                              }
                            >
                              <NumberInputField
                                placeholder="Ingrese el monto"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                            </NumberInput>
                            <FormErrorMessage>{errors.amount}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="paymentMethod">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.paymentMethod && !!errors.paymentMethod}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Método de pago</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar método de pago"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            >
                              {PaymentMethodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="notes">
                        {({ field }: any) => (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <Text>Notas</Text>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese notas adicionales (opcional)"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={3}
                            />
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="receipt-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Actualizando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Actualizar recibo
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
