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
  Progress,
  Box,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Vehicle } from '@/entities/vehicle';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { validateVehicle } from '@/utils/validations/validateVehicle';
import { useUpdateVehicle } from '@/hooks/vehicle';

type VehicleEditProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

export const VehicleEdit = ({ isOpen, onClose, vehicle, setVehicles }: VehicleEditProps) => {
  const toast = useToast();
  const [vehicleProps, setVehicleProps] = useState<Partial<Vehicle>>();
  const { data, isLoading, error, fieldError } = useUpdateVehicle(vehicleProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

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
      setVehicleProps(undefined);
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

  const handleSubmit = (values: Vehicle) => {
    setVehicleProps(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar vehículo
        </ModalHeader>
        <ModalCloseButton />
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
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0">
                <VStack spacing="0.75rem">
                  <FormControl
                    isInvalid={(submitCount > 0 && touched.plate && !!errors.plate) || fieldError?.campo === 'plate'}
                  >
                    <FormLabel>Matrícula</FormLabel>
                    <Field
                      as={Input}
                      name="plate"
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.plate}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={(submitCount > 0 && touched.brand && !!errors.brand) || fieldError?.campo === 'brand'}
                  >
                    <FormLabel>Marca</FormLabel>
                    <Field
                      as={Input}
                      name="brand"
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validateVehicle}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.brand}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={(submitCount > 0 && touched.model && !!errors.model) || fieldError?.campo === 'model'}
                  >
                    <FormLabel>Modelo</FormLabel>
                    <Field
                      as={Input}
                      name="model"
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validateVehicle}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.model}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={
                      (submitCount > 0 && touched.crateCapacity && !!errors.crateCapacity) ||
                      fieldError?.campo === 'crateCapacity'
                    }
                  >
                    <FormLabel>Capacidad de cajón</FormLabel>
                    <Field
                      as={Input}
                      name="crateCapacity"
                      type="number"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.crateCapacity}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter pb="1.5rem">
                <Box mt="0.25rem" w="100%">
                  <Progress
                    h={isLoading ? '4px' : '1px'}
                    mb="1.25rem"
                    size="xs"
                    isIndeterminate={isLoading}
                    colorScheme="blue"
                  />
                  <Button
                    type="submit"
                    bg="#4C88D8"
                    color="white"
                    disabled={isLoading}
                    _hover={{ backgroundColor: '#376bb0' }}
                    width="100%"
                    leftIcon={<FaCheck />}
                    fontSize="1rem"
                  >
                    Guardar cambios
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
