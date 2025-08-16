'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
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
import { FiCalendar, FiTag, FiDollarSign, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { VehicleCost } from '@/entities/vehicleCost';
import { useAddVehicleCost } from '@/hooks/vehicleCost';
import { VehicleCostType, VehicleCostTypeLabels } from '@/enums/vehicleCostType.enum';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type VehicleCostAddProps = {
  isLoading: boolean;
  vehicleId: number;
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
};

type VehicleCostAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  vehicleId: number;
  setCosts: React.Dispatch<React.SetStateAction<VehicleCost[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const VehicleCostAddModal = ({ isOpen, onClose, vehicleId, setCosts }: VehicleCostAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [costProps, setCostProps] = useState<Partial<VehicleCost>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error } = useAddVehicleCost(costProps);

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

  useEffect(() => {
    if (data) {
      toast({
        title: 'Costo creado',
        description: 'El costo ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setCostProps(undefined);
      setCosts((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setCosts, toast, onClose]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error inesperado',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, toast]);

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
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'md' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
      >
        <ModalOverlay />
        <ModalContent maxH="90vh" display="flex" flexDirection="column">
          <ModalHeader
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Nuevo costo
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                date: '',
                type: '',
                amount: '',
                description: '',
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
                  <form id="vehiclecost-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field name="date" validate={validateEmpty}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiCalendar} boxSize="1rem" />
                                <Text>Fecha</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              type="date"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="type" validate={validate}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
                                <Text>Tipo</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar tipo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            >
                              {Object.entries(VehicleCostTypeLabels).map(([key, label]) => (
                                <option key={key} value={key}>
                                  {label}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="amount" validate={validate}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiDollarSign} boxSize="1rem" />
                                <Text>Monto</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              placeholder="Ingrese el monto del costo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="description" validate={validateEmpty}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Descripción</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese una descripción del costo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={4}
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
                form="vehiclecost-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear costo
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
export const VehicleCostAdd = ({ isLoading: isLoadingCosts, vehicleId, setCosts }: VehicleCostAddProps) => {
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
        disabled={isLoadingCosts}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <VehicleCostAddModal isOpen={isOpen} onClose={onClose} vehicleId={vehicleId} setCosts={setCosts} />}
    </>
  );
};
