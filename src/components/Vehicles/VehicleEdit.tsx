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
  VStack,
  Button,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Vehicle } from '@/entities/vehicle';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiTruck, FiTag, FiPackage, FiHash } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { validateVehicle } from '@/utils/validations/validateVehicle';
import { useUpdateVehicle } from '@/hooks/vehicle';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type VehicleEditProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

export const VehicleEdit = ({ isOpen, onClose, vehicle, setVehicles }: VehicleEditProps) => {
  const toast = useToast();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useUpdateVehicle();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Vehículo actualizado',
        description: 'El vehículo ha sido actualizado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setVehicles((prev) => prev.map((v) => (v.id === data.id ? { ...v, ...data } : v)));
      onClose();
    }
  }, [data]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: `Error`,
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

  const handleSubmit = async (values: Vehicle) => {
    await mutate(values);
  };

  const handleClose = () => {
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
            Editar vehículo
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                id: vehicle?.id ?? 0,
                plate: vehicle?.plate ?? '',
                brand: vehicle?.brand ?? '',
                model: vehicle?.model ?? '',
                crateCapacity: vehicle?.crateCapacity ?? 0,
                costs: vehicle?.costs ?? [],
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
                  <form id="vehicle-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="0.75rem">
                      <FormControl isInvalid={submitCount > 0 && touched.plate && !!errors.plate}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiHash} boxSize="1rem" />
                            <Text>Matrícula</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="plate"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validate}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.plate}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.brand && !!errors.brand}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiTag} boxSize="1rem" />
                            <Text>Marca</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="brand"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validateVehicle}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.brand}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.model && !!errors.model}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiTruck} boxSize="1rem" />
                            <Text>Modelo</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="model"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validateVehicle}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.model}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.crateCapacity && !!errors.crateCapacity}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="1rem" />
                            <Text>Capacidad de cajones</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="crateCapacity"
                          type="number"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validate}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.crateCapacity}</FormErrorMessage>
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
                form="vehicle-edit-form"
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
