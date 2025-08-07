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
  useToast,
  VStack,
  Progress,
  Box,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Vehicle } from '@/entities/vehicle';
import { useAddVehicle } from '@/hooks/vehicle';
import { validate } from '@/utils/validations/validate';
import { validateVehicle } from '@/utils/validations/validateVehicle';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type VehicleAddProps = {
  isLoading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

export const VehicleAdd = ({ isLoading: isLoadingVehicles, setVehicles }: VehicleAddProps) => {
  const canCreateVehicles = useUserStore((s) => s.hasPermission(Permission.CREATE_VEHICLES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [vehicleProps, setVehicleProps] = useState<Partial<Vehicle>>();
  const { data, isLoading, error, fieldError } = useAddVehicle(vehicleProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Vehículo creado',
        description: `El vehículo ha sido agregado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setVehicleProps(undefined);
      setVehicles((prev) => [...prev, data]);
      onClose();
    }
  }, [data]);

  useEffect(() => {
    if (fieldError) {
      toast({ title: `Error`, description: fieldError.error, status: 'error', duration: 4000, isClosable: true });
    } else if (error) {
      toast({ title: 'Error inesperado', description: error, status: 'error', duration: 3000, isClosable: true });
    }
  }, [error, fieldError]);

  const handleSubmit = (values: { plate: string; brand: string; model: string; crateCapacity: number }) => {
    const vehicle = {
      ...values,
      crateCapacity: Number(values.crateCapacity),
    };
    setVehicleProps(vehicle);
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
          disabled={isLoadingVehicles}
        >
          Nuevo
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo vehículo
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ plate: '', brand: '', model: '', crateCapacity: 0 }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="0.75rem">
                    <FormControl isInvalid={submitCount > 0 && touched.plate && !!errors.plate}>
                      <FormLabel>Matrícula</FormLabel>
                      <Field
                        as={Input}
                        name="plate"
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={validate}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.plate}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.brand && !!errors.brand}>
                      <FormLabel>Marca</FormLabel>
                      <Field
                        as={Input}
                        name="brand"
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={validateVehicle}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.brand}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.model && !!errors.model}>
                      <FormLabel>Modelo</FormLabel>
                      <Field
                        as={Input}
                        name="model"
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={validateVehicle}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.model}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.crateCapacity && !!errors.crateCapacity}>
                      <FormLabel>Capacidad de cajones</FormLabel>
                      <Field
                        as={Input}
                        name="crateCapacity"
                        type="number"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={(value: any) => {
                          if (Number(value) <= 0) return 'Debe ser mayor o igual a 0';
                          return undefined;
                        }}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.crateCapacity}</FormErrorMessage>
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
