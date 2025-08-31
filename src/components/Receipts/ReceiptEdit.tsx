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
  useToast,
  VStack,
  useColorModeValue,
  Text,
  Textarea,
  HStack,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Receipt } from '@/entities/receipt';
import { useUpdateReceipt } from '@/hooks/receipt';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

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
        title: 'Pago actualizado',
        description: 'El pago ha sido actualizado correctamente.',
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
      id: receipt.id,
      clientId: receipt.client?.id || 0,
      amount: receipt.amount,
      paymentMethod: receipt.paymentMethod,
      date: receipt.date,
      notes: values.notes,
    };
    setReceiptProps(updatedReceipt);
  };

  const validateForm = () => {
    const errors: any = {};
    // No hay validaciones requeridas para las notas ya que es opcional
    return errors;
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
            Editar pago #{receipt.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                clientId: receipt.client?.id?.toString() || '',
                amount: receipt.amount?.toString() || '',
                paymentMethod: receipt.paymentMethod || '',
                date: receipt.date,
                notes: receipt.notes || '',
              }}
              onSubmit={handleSubmit}
              validate={validateForm}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="receipt-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
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
                Actualizar pago
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
