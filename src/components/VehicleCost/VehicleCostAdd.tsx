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
  Input,
  Textarea,
  useToast,
  VStack,
  Progress,
  Box,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { VehicleCost } from '@/entities/vehicleCost';
import { useAddVehicleCost } from '@/hooks/vehicleCost';
import { VehicleCostType, VehicleCostTypeLabels } from '@/enums/vehicleCostType.enum';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type VehicleCostAddProps = {
  isLoading: boolean;
  vehicleId: number;
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
};

export const VehicleCostAdd = ({ isLoading: isLoadingCosts, vehicleId, setCosts }: VehicleCostAddProps) => {
  const canCreateVehicles = useUserStore((s) => s.hasPermission(Permission.CREATE_VEHICLES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [costProps, setCostProps] = useState<Partial<VehicleCost>>();
  const { data, isLoading, error } = useAddVehicleCost(costProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Costo agregado',
        description: 'El nuevo costo fue registrado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setCostProps(undefined);
      setCosts((prev) => [...prev, data]);
      onClose();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({ title: 'Error', description: error, status: 'error', duration: 3000, isClosable: true });
    }
  }, [error]);

  const handleSubmit = (values: { date: string; type: string; amount: string; description: string }) => {
    const newCost: Partial<VehicleCost> = {
      date: new Date(values.date).toISOString(),
      vehicleId,
      type: values.type as VehicleCostType,
      amount: values.amount,
      description: values.description,
    };

    setCostProps(newCost);
  };

  return (
    <>
      {canCreateVehicles && (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          px="1.5rem"
          disabled={isLoadingCosts}
        >
          Nuevo
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo costo
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ date: '', type: '', amount: '', description: '' }}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        disabled={isLoading}
                      />
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      mb="1.5rem"
                      size="xs"
                      isIndeterminate={isLoading}
                      colorScheme="blue"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      bg={submitBg}
                      color="white"
                      _hover={{ backgroundColor: submitHover }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      py="1.375rem"
                    >
                      Confirmar
                    </Button>
                  </Box>
                </ModalFooter>
              </form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
