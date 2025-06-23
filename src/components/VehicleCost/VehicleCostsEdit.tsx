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
import { useUpdateVehicleCost, useDeleteVehicleCost } from '@/hooks/vehicleCost';
import { GenericDelete } from '../shared/GenericDelete';
import { VehicleCostType, VehicleCostTypeLabels } from '@/entities/vehicleCostType';

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
      toast({ title: 'Error', description: fieldError.error, status: 'error', duration: 4000, isClosable: true });
    } else if (error) {
      toast({ title: 'Error inesperado', description: error, status: 'error', duration: 3000, isClosable: true });
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
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar costo
        </ModalHeader>
        <ModalCloseButton />
        <Formik<VehicleCost>
          initialValues={{
            id: cost?.id ?? 0,
            vehicleId: cost?.vehicleId ?? 0,
            date: cost?.date ? new Date(cost.date).toISOString().substring(0, 10) : '',
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
              <ModalBody pb="0">
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
                      {Object.entries(VehicleCostTypeLabels).map(([key, label]) => (
                        <option key={key} value={key}>
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
                  <Box display="flex" gap="0.75rem">
                    {cost && (
                      <GenericDelete
                        item={{ id: cost.id, name: cost.type }}
                        isUpdating={isLoading}
                        setItems={setCosts}
                        useDeleteHook={useDeleteVehicleCost}
                        onDeleted={onClose}
                      />
                    )}
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
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
