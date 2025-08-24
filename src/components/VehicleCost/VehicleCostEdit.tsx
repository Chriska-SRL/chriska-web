'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Select,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { VehicleCost } from '@/entities/vehicleCost';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiCalendar, FiDollarSign, FiTag, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useUpdateVehicleCost } from '@/hooks/vehicleCost';
import { VehicleCostType, VehicleCostTypeOptions } from '@/enums/vehicleCostType.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type VehicleCostEditProps = {
  isOpen: boolean;
  onClose: () => void;
  cost: VehicleCost | null;
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
};

export const VehicleCostEdit = ({ isOpen, onClose, cost, setCosts }: VehicleCostEditProps) => {
  const toast = useToast();
  const [costProps, setCostProps] = useState<Partial<VehicleCost>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useUpdateVehicleCost(costProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Costo actualizado',
        description: 'El costo fue actualizado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setCosts((prev) => prev.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
      setCostProps(undefined);
      onClose();
    }
  }, [data]);

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
  }, [error, fieldError]);

  const handleSubmit = (values: { date: string; type: string; amount: string; description: string }) => {
    const updatedCost: Partial<VehicleCost> = {
      id: cost?.id,
      vehicleId: cost?.vehicleId,
      date: new Date(values.date).toISOString(),
      type: values.type as VehicleCostType,
      amount: values.amount,
      description: values.description,
    };

    setCostProps(updatedCost);
  };

  const handleClose = () => {
    setCostProps(undefined);
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
            Editar costo
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik<VehicleCost>
              initialValues={{
                id: cost?.id ?? 0,
                vehicleId: cost?.vehicleId ?? 0,
                date: cost?.date ? new Date(cost.date).toISOString().split('T')[0] : '',
                type: cost?.type ?? '',
                amount: cost?.amount ?? '',
                description: cost?.description ?? '',
              }}
              onSubmit={handleSubmit}
              validateOnChange
              validateOnBlur={false}
            >
              {({ handleSubmit, errors, touched, submitCount, dirty, resetForm }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="vehicle-cost-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="0.75rem">
                      <FormControl isInvalid={submitCount > 0 && touched.date && !!errors.date}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiCalendar} boxSize="1rem" />
                            <Text>Fecha</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="date"
                          type="date"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.date}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.type && !!errors.type}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiTag} boxSize="1rem" />
                            <Text>Tipo</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Select}
                          name="type"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          disabled={isLoading}
                        >
                          <option value="">Seleccionar tipo</option>
                          {VehicleCostTypeOptions.map(({ value, label }) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </Field>
                        <FormErrorMessage>{errors.type}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.amount && !!errors.amount}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiDollarSign} boxSize="1rem" />
                            <Text>Monto</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="amount"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.amount}</FormErrorMessage>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Descripción</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="description"
                          placeholder="Descripción opcional del costo..."
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          disabled={isLoading}
                          rows={4}
                        />
                      </FormControl>
                    </VStack>
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
                form="vehicle-cost-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Guardando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Guardar cambios
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
