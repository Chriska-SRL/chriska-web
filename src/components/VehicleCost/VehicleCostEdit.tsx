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
  Progress,
  Box,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { VehicleCost } from '@/entities/vehicleCost';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useUpdateVehicleCost } from '@/hooks/vehicleCost';
import { VehicleCostType, VehicleCostTypeOptions } from '@/enums/vehicleCostType.enum';
import { formatDate } from '@/utils/formatters/date';

type VehicleCostEditProps = {
  isOpen: boolean;
  onClose: () => void;
  cost: VehicleCost | null;
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
};

export const VehicleCostEdit = ({ isOpen, onClose, cost, setCosts }: VehicleCostEditProps) => {
  const toast = useToast();
  const [costProps, setCostProps] = useState<Partial<VehicleCost>>();
  const { data, isLoading, error, fieldError } = useUpdateVehicleCost(costProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0">
          Editar costo
        </ModalHeader>
        <ModalCloseButton />
        <Formik<VehicleCost>
          initialValues={{
            id: cost?.id ?? 0,
            vehicleId: cost?.vehicleId ?? 0,
            date: cost?.date ? formatDate(cost.date) : '',
            type: cost?.type ?? '',
            amount: cost?.amount ?? '',
            description: cost?.description ?? '',
          }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody
                pb="0"
                maxH="31rem"
                overflow="auto"
                sx={{
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <VStack spacing="0.75rem">
                  <FormControl isInvalid={submitCount > 0 && touched.date && !!errors.date}>
                    <FormLabel>Fecha</FormLabel>
                    <Field
                      as={Input}
                      name="date"
                      type="date"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.date}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.type && !!errors.type}>
                    <FormLabel>Tipo</FormLabel>
                    <Field
                      as={Select}
                      name="type"
                      bg={inputBg}
                      borderColor={borderColor}
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
                    <FormLabel>Monto</FormLabel>
                    <Field
                      as={Input}
                      name="amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.amount}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      name="description"
                      placeholder="Descripción opcional del costo..."
                      bg={inputBg}
                      borderColor={borderColor}
                      disabled={isLoading}
                    />
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
