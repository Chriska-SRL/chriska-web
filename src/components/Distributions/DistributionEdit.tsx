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
  Textarea,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
  Text,
  Select,
  Box,
  useToast,
  Spinner,
  Flex,
  Stack,
  IconButton,
  Divider,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FiFileText, FiUser, FiTruck, FiPackage } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Distribution } from '@/entities/distribution';
import { User } from '@/entities/user';
import { Vehicle } from '@/entities/vehicle';
import { Delivery } from '@/entities/delivery';
import { useUpdateDistribution } from '@/hooks/distribution';
import { useGetUsers } from '@/hooks/user';
import { useGetVehicles } from '@/hooks/vehicle';
import { useGetZones } from '@/hooks/zone';
import { useGetDeliveries } from '@/hooks/delivery';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { Status } from '@/enums/status.enum';
import { Formik, Field } from 'formik';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';

type DistributionEditProps = {
  isOpen: boolean;
  onClose: () => void;
  distribution: Distribution;
  setDistributions: React.Dispatch<React.SetStateAction<Distribution[]>>;
};

export const DistributionEdit = ({ isOpen, onClose, distribution, setDistributions }: DistributionEditProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const loadingTextColor = useColorModeValue('gray.600', 'gray.400');

  const toast = useToast();

  const [observations, setObservations] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedZones, setSelectedZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState<{ id: number; clientName: string }[]>([]);

  const { data: users, isLoading: isLoadingUsers } = useGetUsers(1, 100);
  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehicles(1, 100);
  const { data: deliveries, isLoading: isLoadingDeliveries } = useGetDeliveries(1, 100);

  const isLoadingData = isLoadingUsers || isLoadingVehicles || isLoadingDeliveries;

  const [updateProps, setUpdateProps] = useState<any>();
  const { data: updatedDistribution, isLoading: isUpdating, error, fieldError } = useUpdateDistribution(updateProps);

  useEffect(() => {
    if (distribution && isOpen) {
      setObservations(distribution.observations || '');
      setSelectedUserId(distribution.user?.id || null);
      setSelectedVehicleId(distribution.vehicle?.id || null);
      setSelectedZones(distribution.zones?.map((z) => ({ id: z.id, name: z.name })) || []);
      setSelectedDeliveries(
        distribution.deliveries?.map((d) => ({ id: d.id, clientName: d.client?.name || '' })) || [],
      );
      setHasChanges(false);
    }
  }, [distribution, isOpen]);

  useEffect(() => {
    if (updatedDistribution) {
      toast({
        title: 'Reparto actualizado',
        description: 'El reparto ha sido actualizado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setDistributions((prev) => prev.map((d) => (d.id === updatedDistribution.id ? updatedDistribution : d)));
      setUpdateProps(undefined);
      resetForm();
      onClose();
    }
  }, [updatedDistribution]);

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

  const handleClose = () => {
    if (hasChanges) {
      setShowConfirmDialog(true);
    } else {
      resetForm();
      onClose();
    }
  };

  const confirmClose = () => {
    setShowConfirmDialog(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setObservations('');
    setSelectedUserId(null);
    setSelectedVehicleId(null);
    setSelectedZones([]);
    setSelectedDeliveries([]);
    setHasChanges(false);
    setUpdateProps(undefined);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
  };

  const handleSubmit = (values: any) => {
    setUpdateProps({
      id: distribution.id,
      observations: values.observations,
      userId: Number(values.userId),
      vehicleId: Number(values.vehicleId),
      zoneIds: selectedZones.map((z) => z.id),
      deliveryIds: selectedDeliveries.map((d) => d.id),
    });
  };

  const validateForm = (values: any) => {
    const errors: any = {};
    
    if (!values.userId) {
      errors.userId = 'Debe seleccionar un usuario';
    }
    
    if (!values.vehicleId) {
      errors.vehicleId = 'Debe seleccionar un vehículo';
    }
    
    return errors;
  };

  const handleFieldChange = () => {
    if (!hasChanges) setHasChanges(true);
  };

  const moveDeliveryUp = (index: number) => {
    if (index > 0) {
      const newDeliveries = [...selectedDeliveries];
      [newDeliveries[index - 1], newDeliveries[index]] = [newDeliveries[index], newDeliveries[index - 1]];
      setSelectedDeliveries(newDeliveries);
      handleFieldChange();
    }
  };

  const moveDeliveryDown = (index: number) => {
    if (index < selectedDeliveries.length - 1) {
      const newDeliveries = [...selectedDeliveries];
      [newDeliveries[index], newDeliveries[index + 1]] = [newDeliveries[index + 1], newDeliveries[index]];
      setSelectedDeliveries(newDeliveries);
      handleFieldChange();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose} size={{ base: 'xs', md: 'xl' }} isCentered>
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
            Editar reparto
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            {isLoadingData ? (
              <Flex justify="center" align="center" minH="300px">
                <VStack spacing="1rem">
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                  <Text color={loadingTextColor}>Cargando datos...</Text>
                </VStack>
              </Flex>
            ) : (
              <Formik
                initialValues={{
                  userId: selectedUserId || '',
                  vehicleId: selectedVehicleId || '',
                  observations: observations || '',
                }}
                validate={validateForm}
                onSubmit={handleSubmit}
                enableReinitialize
                validateOnChange={true}
                validateOnBlur={false}
              >
                {({ handleSubmit, values, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                  // Update hasChanges and formik instance
                  useEffect(() => {
                    if (dirty !== hasChanges) {
                      setHasChanges(dirty);
                    }
                    setFormikInstance({ dirty, resetForm });
                  }, [dirty, resetForm]);

                  return (
                    <form id="distribution-edit-form" onSubmit={handleSubmit}>
                      <VStack spacing="1rem" align="stretch">
                        <Field name="userId">
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.userId && !!errors.userId}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Usuario</Text>
                                </HStack>
                              </FormLabel>
                              <Select
                                {...field}
                                placeholder={isLoadingUsers ? 'Cargando usuarios...' : 'Seleccione un usuario'}
                                isDisabled={isLoadingUsers}
                                onChange={(e) => {
                                  setFieldValue('userId', e.target.value);
                                  setSelectedUserId(e.target.value ? Number(e.target.value) : null);
                                }}
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isUpdating}
                              >
                                {users?.map((user: User) => (
                                  <option key={user.id} value={user.id}>
                                    {user.name}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>{errors.userId}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="vehicleId">
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.vehicleId && !!errors.vehicleId}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiTruck} boxSize="1rem" />
                                  <Text>Vehículo</Text>
                                </HStack>
                              </FormLabel>
                              <Select
                                {...field}
                                placeholder={isLoadingVehicles ? 'Cargando vehículos...' : 'Seleccione un vehículo'}
                                isDisabled={isLoadingVehicles}
                                onChange={(e) => {
                                  setFieldValue('vehicleId', e.target.value);
                                  setSelectedVehicleId(e.target.value ? Number(e.target.value) : null);
                                }}
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isUpdating}
                              >
                                {vehicles?.map((vehicle: Vehicle) => (
                                  <option key={vehicle.id} value={vehicle.id}>
                                    {vehicle.plate} - {vehicle.model}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>{errors.vehicleId}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                <FormControl>
                  <FormLabel fontWeight="semibold">
                    <HStack spacing="0.5rem">
                      <Icon as={FiPackage} boxSize="1rem" />
                      <Text>Entregas (opcional)</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    placeholder="Seleccione una entrega para agregar"
                    value=""
                    onChange={(e) => {
                      const deliveryId = Number(e.target.value);
                      const delivery = deliveries?.find((d: Delivery) => d.id === deliveryId);
                      if (delivery && !selectedDeliveries.some((d) => d.id === deliveryId)) {
                        setSelectedDeliveries((prev) => [
                          ...prev,
                          { id: delivery.id, clientName: delivery.client?.name || '' },
                        ]);
                        handleFieldChange();
                      }
                    }}
                    bg={inputBg}
                    border="1px solid"
                    borderColor={inputBorder}
                    isDisabled={isUpdating || isLoadingDeliveries}
                  >
                    {deliveries
                      ?.filter(
                        (delivery: Delivery) =>
                          (delivery.status === Status.PENDING ||
                            distribution.deliveries?.some((d) => d.id === delivery.id)) &&
                          !selectedDeliveries.some((sd) => sd.id === delivery.id),
                      )
                      .map((delivery: Delivery) => (
                        <option key={delivery.id} value={delivery.id}>
                          Entrega #{delivery.id} - {delivery.client?.name}
                        </option>
                      ))}
                  </Select>

                  {selectedDeliveries.length > 0 && (
                    <Box mt="1rem">
                      <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                        Entregas seleccionadas ({selectedDeliveries.length}):
                      </Text>
                      <Box
                        maxH="150px"
                        overflowY="auto"
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="md"
                        p="0.5rem 1rem"
                      >
                        <Stack spacing="0">
                          {selectedDeliveries.map((delivery, index) => (
                            <Box key={delivery.id}>
                              {index > 0 && <Divider my="0.25rem" />}
                              <Flex align="center" justify="space-between" py="0.25rem">
                                <Box flex="1">
                                  <Text fontSize="sm" fontWeight="medium">
                                    Entrega #{delivery.id}
                                  </Text>
                                  <Text fontSize="xs" color={textColor}>
                                    {delivery.clientName}
                                  </Text>
                                </Box>
                                <HStack spacing="0.5rem">
                                  {selectedDeliveries.length > 1 && (
                                    <>
                                      <IconButton
                                        aria-label="Mover arriba"
                                        icon={<FaChevronUp />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => moveDeliveryUp(index)}
                                        isDisabled={isUpdating || index === 0}
                                      />
                                      <IconButton
                                        aria-label="Mover abajo"
                                        icon={<FaChevronDown />}
                                        size="sm"
                                        variant="ghost"
                                        colorScheme="blue"
                                        onClick={() => moveDeliveryDown(index)}
                                        isDisabled={isUpdating || index === selectedDeliveries.length - 1}
                                      />
                                    </>
                                  )}
                                  <IconButton
                                    aria-label="Remover entrega"
                                    icon={<FaTimes />}
                                    size="sm"
                                    variant="ghost"
                                    color="red.500"
                                    onClick={() => {
                                      setSelectedDeliveries((prev) => prev.filter((d) => d.id !== delivery.id));
                                      handleFieldChange();
                                    }}
                                    isDisabled={isUpdating}
                                  />
                                </HStack>
                              </Flex>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  )}
                </FormControl>

                        <Field name="observations">
                          {({ field }: any) => (
                            <FormControl>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiFileText} boxSize="1rem" />
                                  <Text>Observaciones</Text>
                                </HStack>
                              </FormLabel>
                              <Textarea
                                {...field}
                                placeholder="Ingrese observaciones adicionales"
                                onChange={(e) => {
                                  setFieldValue('observations', e.target.value);
                                  setObservations(e.target.value);
                                }}
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                rows={3}
                                resize="vertical"
                                disabled={isUpdating}
                              />
                            </FormControl>
                          )}
                        </Field>
                      </VStack>
                    </form>
                  );
                }}
              </Formik>
            )}
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} isDisabled={isUpdating} size="sm">
                Cancelar
              </Button>
              <Button
                form="distribution-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isUpdating}
                loadingText="Actualizando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Actualizar reparto
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmClose}
      />
    </>
  );
};
