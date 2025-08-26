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
  Input,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FiFileText, FiUser, FiTruck, FiPackage } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Distribution } from '@/entities/distribution';
import { User } from '@/entities/user';
import { Vehicle } from '@/entities/vehicle';
import { Delivery } from '@/entities/delivery';
import { useUpdateDistribution } from '@/hooks/distribution';
import { useGetUsers } from '@/hooks/user';
import { useGetVehicles } from '@/hooks/vehicle';
import { useGetDeliveries } from '@/hooks/delivery';
import { useGetClients } from '@/hooks/client';
import { useDebounce } from '@/hooks/useDebounce';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { Status } from '@/enums/status.enum';
import { Formik, Field } from 'formik';

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
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dropdownBg = useColorModeValue('white', 'gray.800');

  const toast = useToast();

  const [observations, setObservations] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedZones, setSelectedZones] = useState<{ id: number; name: string }[]>([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState<{ id: number; clientName: string }[]>([]);

  // Estados para búsqueda de cliente y entregas pendientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // Usar el hook de debounce
  const debouncedClientSearch = useDebounce(clientSearch, 500);

  const clientFilters = useMemo(() => {
    if (!debouncedClientSearch || debouncedClientSearch.length < 2) return undefined;

    return {
      ...(clientSearchType === 'name' && { name: debouncedClientSearch }),
      ...(clientSearchType === 'rut' && { rut: debouncedClientSearch }),
      ...(clientSearchType === 'razonSocial' && { razonSocial: debouncedClientSearch }),
      ...(clientSearchType === 'contactName' && { contactName: debouncedClientSearch }),
    };
  }, [debouncedClientSearch, clientSearchType]);

  const { data: users, isLoading: isLoadingUsers } = useGetUsers(1, 100);
  const { data: vehicles, isLoading: isLoadingVehicles } = useGetVehicles(1, 100);
  const { data: deliveries, isLoading: isLoadingDeliveries } = useGetDeliveries(1, 100);
  const { data: clientsSearch = [], isLoading: isLoadingClientsSearch } = useGetClients(1, 10, clientFilters);

  // Filtrar entregas pendientes del cliente seleccionado
  const clientPendingDeliveries = useMemo(() => {
    if (!selectedClient || !deliveries) return [];
    return deliveries.filter(
      (delivery: Delivery) =>
        delivery.client?.id === selectedClient.id &&
        delivery.status === Status.PENDING &&
        !selectedDeliveries.some((sd) => sd.id === delivery.id)
    );
  }, [selectedClient, deliveries, selectedDeliveries]);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    setClientSearch('');
    setSelectedClient(null);
    setShowClientDropdown(false);
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

  // Handlers para búsqueda de cliente
  const handleClientSearch = (value: string) => {
    setClientSearch(value);
    setShowClientDropdown(value.length >= 2);
    if (selectedClient && value !== selectedClient.name) {
      setSelectedClient(null);
    }
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient({ id: client.id, name: client.name });
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const handleClearClientSearch = () => {
    setClientSearch('');
    setSelectedClient(null);
    setShowClientDropdown(false);
  };

  // Handler para agregar entrega del cliente seleccionado
  const handleAddClientDelivery = (deliveryId: number) => {
    const delivery = clientPendingDeliveries.find((d) => d.id === deliveryId);
    if (delivery && !selectedDeliveries.some((d) => d.id === deliveryId)) {
      setSelectedDeliveries((prev) => [
        ...prev,
        { id: delivery.id, clientName: delivery.client?.name || '' },
      ]);
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
                {({ handleSubmit, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
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

                        {/* Buscador de cliente para agregar entregas */}
                        <FormControl>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiPackage} boxSize="1rem" />
                              <Text>Agregar entregas por cliente</Text>
                            </HStack>
                          </FormLabel>
                          <Box position="relative" ref={clientSearchRef}>
                            <Input
                              as={Box}
                              display="flex"
                              bg={inputBg}
                              borderRadius="md"
                              overflow="hidden"
                              borderWidth="1px"
                              borderColor={inputBorder}
                              disabled={isUpdating}
                              p={0}
                            >
                              <Select
                                value={clientSearchType}
                                onChange={(e) =>
                                  setClientSearchType(e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName')
                                }
                                bg="transparent"
                                border="none"
                                w="auto"
                                minW={{ base: '4.5rem', md: '7rem' }}
                                maxW={{ base: '5rem', md: '8rem' }}
                                borderRadius="none"
                                _focus={{ boxShadow: 'none' }}
                                disabled={isUpdating}
                                fontSize={{ base: 'sm', md: 'md' }}
                              >
                                <option value="name">Nombre</option>
                                <option value="rut">RUT</option>
                                <option value="razonSocial">Razón Social</option>
                                <option value="contactName">Contacto</option>
                              </Select>

                              <Box w="1px" bg={inputBorder} alignSelf="stretch" my="0.5rem" />

                              <InputGroup flex="1">
                                <Input
                                  placeholder="Buscar cliente..."
                                  value={clientSearch}
                                  onChange={(e) => handleClientSearch(e.target.value)}
                                  bg="transparent"
                                  border="none"
                                  borderRadius="none"
                                  _focus={{ boxShadow: 'none' }}
                                  pl="1rem"
                                  disabled={isUpdating}
                                  onFocus={() => clientSearch && setShowClientDropdown(true)}
                                />
                                <InputRightElement>
                                  {selectedClient ? (
                                    <IconButton
                                      aria-label="Limpiar búsqueda"
                                      icon={<Text fontSize="sm">✕</Text>}
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleClearClientSearch}
                                      _hover={{}}
                                    />
                                  ) : (
                                    <Icon as={AiOutlineSearch} boxSize="1.25rem" />
                                  )}
                                </InputRightElement>
                              </InputGroup>
                            </Input>

                            {/* Dropdown de resultados de clientes */}
                            {showClientDropdown && (
                              <Box
                                position="absolute"
                                top="100%"
                                left={0}
                                right={0}
                                mt={1}
                                bg={dropdownBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                borderRadius="md"
                                boxShadow="lg"
                                maxH="200px"
                                overflowY="auto"
                                zIndex={20}
                              >
                                {(() => {
                                  const isTyping = clientSearch !== debouncedClientSearch && clientSearch.length >= 2;
                                  const isSearching = !isTyping && isLoadingClientsSearch && debouncedClientSearch.length >= 2;
                                  const searchCompleted = !isTyping && !isSearching && debouncedClientSearch.length >= 2;

                                  if (isTyping || isSearching) {
                                    return (
                                      <Flex p={3} justify="center" align="center" gap={2}>
                                        <Spinner size="sm" />
                                        <Text fontSize="sm" color="gray.500">
                                          Buscando clientes...
                                        </Text>
                                      </Flex>
                                    );
                                  }

                                  if (searchCompleted && clientsSearch?.length > 0) {
                                    return (
                                      <List>
                                        {clientsSearch.map((client: any) => (
                                          <ListItem
                                            key={client.id}
                                            cursor="pointer"
                                            _hover={{ bg: hoverBg }}
                                            onClick={() => handleClientSelect(client)}
                                            transition="background-color 0.2s ease"
                                          >
                                            <Box p={3}>
                                              <Text fontSize="sm" fontWeight="medium">
                                                {client.name}
                                              </Text>
                                              <Text fontSize="xs" color="gray.500">
                                                {client.rut && `RUT: ${client.rut}`}
                                                {client.contactName && ` - Contacto: ${client.contactName}`}
                                              </Text>
                                            </Box>
                                          </ListItem>
                                        ))}
                                      </List>
                                    );
                                  }

                                  if (searchCompleted && clientsSearch?.length === 0) {
                                    return (
                                      <Text p={3} fontSize="sm" color="gray.500">
                                        No se encontraron clientes
                                      </Text>
                                    );
                                  }

                                  return null;
                                })()}
                              </Box>
                            )}
                          </Box>

                          {/* Select de entregas pendientes del cliente seleccionado */}
                          {selectedClient && (
                            <Box mt="1rem">
                              <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                                Entregas pendientes de {selectedClient.name}:
                              </Text>
                              <Select
                                placeholder="Seleccione una entrega para agregar"
                                value=""
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAddClientDelivery(Number(e.target.value));
                                    e.target.value = ''; // Reset select
                                  }
                                }}
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                isDisabled={isUpdating || clientPendingDeliveries.length === 0}
                              >
                                {clientPendingDeliveries.map((delivery: Delivery) => (
                                  <option key={delivery.id} value={delivery.id}>
                                    Entrega #{delivery.id}
                                  </option>
                                ))}
                              </Select>
                              {clientPendingDeliveries.length === 0 && (
                                <Text fontSize="xs" color="gray.500" mt="0.25rem">
                                  Este cliente no tiene entregas pendientes disponibles.
                                </Text>
                              )}
                            </Box>
                          )}

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
