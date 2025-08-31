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
  Box,
  Textarea,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Delivery } from '@/entities/delivery';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { useUpdateDelivery } from '@/hooks/delivery';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type DeliveryEditProps = {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery | null;
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const DeliveryEditForm = ({
  isOpen,
  onClose,
  delivery,
  setDeliveries,
}: {
  isOpen: boolean;
  onClose: () => void;
  delivery: Delivery;
  setDeliveries: React.Dispatch<React.SetStateAction<Delivery[]>>;
}) => {
  const toast = useToast();
  const [deliveryProps, setDeliveryProps] = useState<Partial<Delivery>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useUpdateDelivery(deliveryProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const handleClose = () => {
    setDeliveryProps(undefined);
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
        title: 'Entrega actualizada',
        description: 'La entrega ha sido actualizada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setDeliveries((prev) => prev.map((d) => (d.id === data.id ? data : d)));
      setDeliveryProps(undefined);
      handleClose();
    }
  }, [data, setDeliveries, toast, onClose]);

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

  const handleSubmit = (values: { id: number; observations: string }) => {
    const updatedDelivery = {
      id: values.id,
      observations: values.observations,
    };
    setDeliveryProps(updatedDelivery);
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
            Editar entrega #{delivery.id}
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                id: delivery.id,
                observations: delivery.observations || '',
              }}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty, resetForm }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="delivery-edit-form" onSubmit={handleSubmit}>
                    <Box>
                      <VStack spacing="1rem" align="stretch">
                        <Field name="observations" validate={validateEmpty}>
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiFileText} boxSize="1rem" />
                                  <Text>Observaciones</Text>
                                </HStack>
                              </FormLabel>
                              <Textarea
                                {...field}
                                placeholder="Ingrese observaciones sobre la entrega..."
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                                rows={6}
                              />
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
                form="delivery-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Actualizando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Actualizar entrega
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
export const DeliveryEdit = ({ isOpen, onClose, delivery, setDeliveries }: DeliveryEditProps) => {
  // Solo renderizar el formulario cuando el modal está abierto y hay delivery
  if (!isOpen || !delivery) return null;

  return <DeliveryEditForm isOpen={isOpen} onClose={onClose} delivery={delivery} setDeliveries={setDeliveries} />;
};
