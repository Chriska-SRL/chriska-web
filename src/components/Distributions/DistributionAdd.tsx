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
  useDisclosure,
  VStack,
  useColorModeValue,
  HStack,
  Icon,
  Text,
  Select,
  Box,
  useToast,
  InputGroup,
  InputRightElement,
  Input,
  List,
  ListItem,
  Flex,
  Spinner,
  Divider,
  IconButton,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { FiFileText, FiUser, FiTruck, FiMapPin } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { Distribution } from '@/entities/distribution';
import { User } from '@/entities/user';
import { Vehicle } from '@/entities/vehicle';
import { Zone } from '@/entities/zone';
import { useAddDistribution } from '@/hooks/distribution';
import { useGetUsers } from '@/hooks/user';
import { useGetVehicles } from '@/hooks/vehicle';
import { useGetZones } from '@/hooks/zone';
import { useGetClients } from '@/hooks/client';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { Formik, Field } from 'formik';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';

type DistributionAddProps = {
  isLoading: boolean;
  setDistributions: React.Dispatch<React.SetStateAction<Distribution[]>>;
};

type DistributionAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setDistributions: React.Dispatch<React.SetStateAction<Distribution[]>>;
};

const DistributionAddModal = ({ isOpen, onClose, setDistributions }: DistributionAddModalProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const toast = useToast();

  const [observations, setObservations] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(null);
  const [selectedZones, setSelectedZones] = useState<{ id: number; name: string }[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClients, setSelectedClients] = useState<
    Array<{ id: number; name: string; rut?: string; contactName?: string }>
  >([]);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState(clientSearch);
  const [lastClientSearchTerm, setLastClientSearchTerm] = useState('');

  const clientSearchRef = useRef<HTMLDivElement>(null);

  const { data: users } = useGetUsers(1, 100);
  const { data: vehicles } = useGetVehicles(1, 100);
  const { data: zones } = useGetZones(1, 100);

  // Simple debounce implementation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  const clientFilters = useMemo(() => {
    if (!debouncedClientSearch || debouncedClientSearch.length < 2) return undefined;
    const filters: any = {};
    switch (clientSearchType) {
      case 'name':
        filters.name = debouncedClientSearch;
        break;
      case 'rut':
        filters.rut = debouncedClientSearch;
        break;
      case 'razonSocial':
        filters.razonSocial = debouncedClientSearch;
        break;
      case 'contactName':
        filters.contactName = debouncedClientSearch;
        break;
    }
    return filters;
  }, [debouncedClientSearch, clientSearchType]);

  const actualClientFilters =
    clientFilters && debouncedClientSearch && debouncedClientSearch.length >= 2 ? clientFilters : undefined;

  const { data: clientsSearch = [], isLoading: isLoadingClientsSearch } = useGetClients(1, 10, actualClientFilters);

  const [addProps, setAddProps] = useState<any>();
  const { data: addedDistribution, isLoading: isAdding, error, fieldError } = useAddDistribution(addProps);

  useEffect(() => {
    if (addedDistribution) {
      toast({
        title: 'Reparto creado',
        description: 'El reparto ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setDistributions((prev) => [...prev, addedDistribution]);
      setAddProps(undefined);
      resetForm();
      onClose();
    }
  }, [addedDistribution]);

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

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingClientsSearch && debouncedClientSearch && debouncedClientSearch.length >= 2) {
      setLastClientSearchTerm(debouncedClientSearch);
    }
  }, [isLoadingClientsSearch, debouncedClientSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    setObservations('');
    setSelectedUserId(null);
    setSelectedVehicleId(null);
    setSelectedZones([]);
    setSelectedClients([]);
    setClientSearch('');
    setShowClientDropdown(false);
    setHasChanges(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
  };

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

  const handleSubmit = (values: any) => {
    setAddProps({
      observations: values.observations,
      userId: Number(values.userId),
      vehicleId: Number(values.vehicleId),
      zoneIds: selectedZones.map((z) => z.id),
      clientIds: selectedClients.map((c) => c.id),
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
    
    if (selectedZones.length === 0 && selectedClients.length === 0) {
      errors.zones = 'Debe seleccionar al menos una zona o un cliente';
    }
    
    return errors;
  };

  const handleFieldChange = () => {
    if (!hasChanges) setHasChanges(true);
  };

  const handleZoneSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zoneId = Number(e.target.value);
    const zone = zones?.find((z: Zone) => z.id === zoneId);
    if (zone && !selectedZones.some((z) => z.id === zoneId)) {
      setSelectedZones((prev) => [...prev, { id: zone.id, name: zone.name }]);
      handleFieldChange();
    }
  };

  const handleRemoveZone = (zoneId: number) => {
    setSelectedZones((prev) => prev.filter((z) => z.id !== zoneId));
    handleFieldChange();
  };

  const handleClientSearch = (value: string) => {
    setClientSearch(value);
    if (value.length >= 2) {
      setShowClientDropdown(true);
    } else {
      setShowClientDropdown(false);
    }
  };

  const handleClientSelect = (client: any) => {
    const isAlreadySelected = selectedClients.some((c) => c.id === client.id);
    if (!isAlreadySelected) {
      setSelectedClients((prev) => [
        ...prev,
        {
          id: client.id,
          name: client.name,
          rut: client.rut,
          contactName: client.contactName,
        },
      ]);
    }
    setClientSearch('');
    setShowClientDropdown(false);
    handleFieldChange();
  };

  const handleRemoveClient = (clientId: number) => {
    setSelectedClients((prev) => prev.filter((c) => c.id !== clientId));
    handleFieldChange();
  };

  const handleClearClientSearch = () => {
    setClientSearch('');
    setShowClientDropdown(false);
  };

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
            Nuevo reparto
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                userId: '',
                vehicleId: '',
                observations: '',
              }}
              validate={validateForm}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, values, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                // Update hasChanges based on form dirty state and formik instance
                useEffect(() => {
                  if (dirty !== hasChanges) {
                    setHasChanges(dirty);
                  }
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="distribution-add-form" onSubmit={handleSubmit}>
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
                              placeholder="Seleccione un usuario"
                              onChange={(e) => {
                                setFieldValue('userId', e.target.value);
                                setSelectedUserId(e.target.value ? Number(e.target.value) : null);
                              }}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isAdding}
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
                              placeholder="Seleccione un vehículo"
                              onChange={(e) => {
                                setFieldValue('vehicleId', e.target.value);
                                setSelectedVehicleId(e.target.value ? Number(e.target.value) : null);
                              }}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isAdding}
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

                      <FormControl isInvalid={submitCount > 0 && !!errors.zones}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMapPin} boxSize="1rem" />
                            <Text>Zonas</Text>
                          </HStack>
                        </FormLabel>
                <Select
                  placeholder="Seleccione una zona para agregar"
                  value=""
                  onChange={handleZoneSelect}
                  bg={inputBg}
                  border="1px solid"
                  borderColor={inputBorder}
                >
                  {zones
                    ?.filter((zone: Zone) => !selectedZones.some((sz) => sz.id === zone.id))
                    .map((zone: Zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                </Select>

                {selectedZones.length > 0 && (
                  <Box mt="1rem">
                    <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                      Zonas seleccionadas ({selectedZones.length}):
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
                        {selectedZones.map((zone, index) => (
                          <Box key={zone.id}>
                            {index > 0 && <Divider my="0.25rem" />}
                            <Flex align="center" justify="space-between" py="0.25rem">
                              <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium">
                                  {zone.name}
                                </Text>
                              </Box>
                              <IconButton
                                aria-label="Remover zona"
                                icon={<FaTimes />}
                                size="sm"
                                variant="ghost"
                                color="red.500"
                                onClick={() => handleRemoveZone(zone.id)}
                              />
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                )}
                        <FormErrorMessage>{errors.zones}</FormErrorMessage>
                      </FormControl>

              <FormControl>
                <FormLabel fontWeight="semibold">
                  <HStack spacing="0.5rem">
                    <Icon as={FiUser} boxSize="1rem" />
                    <Text>Clientes</Text>
                  </HStack>
                </FormLabel>

                {/* Buscador de clientes */}
                <Box position="relative" ref={clientSearchRef}>
                  <Flex bg={inputBg} borderRadius="md" overflow="hidden" borderWidth="1px" borderColor={inputBorder}>
                    <Select
                      value={clientSearchType}
                      onChange={(e) =>
                        setClientSearchType(e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName')
                      }
                      bg="transparent"
                      border="none"
                      color={textColor}
                      w="auto"
                      minW="7rem"
                      maxW="8rem"
                      borderRadius="none"
                      _focus={{ boxShadow: 'none' }}
                    >
                      <option value="name">Nombre</option>
                      <option value="rut">RUT</option>
                      <option value="razonSocial">Razón social</option>
                      <option value="contactName">Contacto</option>
                    </Select>

                    <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

                    <InputGroup flex="1">
                      <Input
                        placeholder="Buscar cliente..."
                        value={clientSearch}
                        onChange={(e) => handleClientSearch(e.target.value)}
                        bg="transparent"
                        border="none"
                        borderRadius="none"
                        _placeholder={{ color: textColor }}
                        color={textColor}
                        _focus={{ boxShadow: 'none' }}
                        pl="1rem"
                        onFocus={() => clientSearch && setShowClientDropdown(true)}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label="Buscar"
                          icon={<AiOutlineSearch size="1.25rem" />}
                          size="sm"
                          variant="ghost"
                          color={textColor}
                          _hover={{}}
                          onClick={handleClearClientSearch}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </Flex>

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
                      borderColor={dropdownBorder}
                      borderRadius="md"
                      boxShadow="lg"
                      maxH="300px"
                      overflowY="auto"
                      zIndex={20}
                    >
                      {(() => {
                        const isTyping = clientSearch !== debouncedClientSearch && clientSearch.length >= 2;
                        const isSearching = !isTyping && isLoadingClientsSearch && debouncedClientSearch.length >= 2;
                        const searchCompleted =
                          !isTyping &&
                          !isSearching &&
                          debouncedClientSearch.length >= 2 &&
                          lastClientSearchTerm === debouncedClientSearch;

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
                            <List spacing={0}>
                              {clientsSearch.map((client: any, index: number) => {
                                const isSelected = selectedClients.some((c) => c.id === client.id);
                                return (
                                  <Fragment key={client.id}>
                                    <ListItem
                                      p="0.75rem"
                                      cursor="pointer"
                                      _hover={{ bg: hoverBg }}
                                      transition="background-color 0.2s ease"
                                      opacity={isSelected ? 0.5 : 1}
                                      onClick={() => !isSelected && handleClientSelect(client)}
                                    >
                                      <Box>
                                        <Text fontSize="sm" fontWeight="medium">
                                          {client.name}
                                        </Text>
                                        <Text fontSize="xs" color={textColor}>
                                          {client.rut && `RUT: ${client.rut}`}
                                          {client.contactName && ` - Contacto: ${client.contactName}`}
                                        </Text>
                                        {isSelected && (
                                          <Text fontSize="xs" color="green.500">
                                            Seleccionado
                                          </Text>
                                        )}
                                      </Box>
                                    </ListItem>
                                    {index < clientsSearch.length - 1 && <Divider />}
                                  </Fragment>
                                );
                              })}
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

                        if (debouncedClientSearch.length >= 2 && (!searchCompleted || isLoadingClientsSearch)) {
                          return (
                            <Flex p={3} justify="center" align="center" gap={2}>
                              <Spinner size="sm" />
                              <Text fontSize="sm" color="gray.500">
                                Buscando clientes...
                              </Text>
                            </Flex>
                          );
                        }

                        return null;
                      })()}
                    </Box>
                  )}
                </Box>

                {/* Lista de clientes seleccionados */}
                {selectedClients.length > 0 && (
                  <Box mt="1rem">
                    <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                      Clientes seleccionados ({selectedClients.length}):
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
                        {selectedClients.map((client, index) => (
                          <Box key={client.id}>
                            {index > 0 && <Divider my="0.25rem" />}
                            <Flex align="center" justify="space-between" py="0.25rem">
                              <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium">
                                  {client.name}
                                </Text>
                                <Text fontSize="xs" color={textColor}>
                                  {client.rut && `RUT: ${client.rut}`}
                                  {client.contactName && ` - Contacto: ${client.contactName}`}
                                </Text>
                              </Box>
                              <IconButton
                                aria-label="Remover cliente"
                                icon={<FaTimes />}
                                size="sm"
                                variant="ghost"
                                color="red.500"
                                onClick={() => handleRemoveClient(client.id)}
                              />
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
                              disabled={isAdding}
                            />
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
              <Button variant="ghost" onClick={handleClose} isDisabled={isAdding} size="sm">
                Cancelar
              </Button>
              <Button
                form="distribution-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isAdding}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear reparto
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

// Componente principal que controla cuándo renderizar el modal
export const DistributionAdd = ({ isLoading, setDistributions }: DistributionAddProps) => {
  const canAddDistributions = useUserStore((s) => s.hasPermission(Permission.ADD_DISTRIBUTIONS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!canAddDistributions) return null;

  return (
    <>
      <Button
        bg={useColorModeValue('#f2f2f2', 'gray.700')}
        _hover={{ bg: useColorModeValue('#e0dede', 'gray.500') }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        isDisabled={isLoading}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el modal cuando está abierto */}
      {isOpen && <DistributionAddModal isOpen={isOpen} onClose={onClose} setDistributions={setDistributions} />}
    </>
  );
};
