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
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiTruck, FiTag, FiBox, FiHash } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Vehicle } from '@/entities/vehicle';
import { useAddVehicle } from '@/hooks/vehicle';
import { validate } from '@/utils/validations/validate';
import { validateVehicle } from '@/utils/validations/validateVehicle';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type VehicleAddProps = {
  isLoading: boolean;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

type VehicleAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const VehicleAddModal = ({ isOpen, onClose, setVehicles }: VehicleAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [vehicleProps, setVehicleProps] = useState<Partial<Vehicle>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddVehicle(vehicleProps);

  const handleClose = () => {
    setVehicleProps(undefined);
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
        title: 'Vehículo creado',
        description: 'El vehículo ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setVehicleProps(undefined);
      setVehicles((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setVehicles, toast, onClose]);

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

  const handleSubmit = (values: { plate: string; brand: string; model: string; crateCapacity: number }) => {
    const vehicle = {
      ...values,
      crateCapacity: Number(values.crateCapacity),
    };
    setVehicleProps(vehicle);
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
            Nuevo vehículo
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                plate: '',
                brand: '',
                model: '',
                crateCapacity: 0,
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
                  <form id="vehicle-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field name="plate" validate={validate}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiHash} boxSize="1rem" />
                                <Text>Matrícula</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese la matrícula del vehículo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="brand" validate={validateVehicle}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
                                <Text>Marca</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese la marca del vehículo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="model" validate={validateVehicle}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTruck} boxSize="1rem" />
                                <Text>Modelo</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el modelo del vehículo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field
                        name="crateCapacity"
                        validate={(value: any) => {
                          if (Number(value) <= 0) return 'Debe ser mayor o igual a 0';
                          return undefined;
                        }}
                      >
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiBox} boxSize="1rem" />
                                <Text>Capacidad de cajones</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              type="number"
                              placeholder="Ingrese la capacidad de cajones"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
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
                form="vehicle-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear vehículo
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

// Componente principal que controla la apertura del modal
export const VehicleAdd = ({ isLoading: isLoadingVehicles, setVehicles }: VehicleAddProps) => {
  const canCreateVehicles = useUserStore((s) => s.hasPermission(Permission.CREATE_VEHICLES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateVehicles) return null;

  return (
    <>
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

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <VehicleAddModal isOpen={isOpen} onClose={onClose} setVehicles={setVehicles} />}
    </>
  );
};
