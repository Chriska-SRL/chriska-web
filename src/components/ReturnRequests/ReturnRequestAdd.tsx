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
  useToast,
  VStack,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Input,
  Box,
  Flex,
  Select,
  Divider,
  IconButton,
  Spinner,
} from '@chakra-ui/react';
import { Formik } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiUsers, FiTruck } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useState, useEffect, useRef, useMemo, Fragment } from 'react';
import { ReturnRequest } from '@/entities/returnRequest';
import { useAddReturnRequest } from '@/hooks/returnRequest';
import { useGetClients } from '@/hooks/client';
import { useGetConfirmedDeliveriesByClient } from '@/hooks/delivery';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ReturnRequestAddProps = {
  isLoading: boolean;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
};

type ReturnRequestAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setReturnRequests: React.Dispatch<React.SetStateAction<ReturnRequest[]>>;
};

const ReturnRequestAddModal = ({ isOpen, onClose, setReturnRequests }: ReturnRequestAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const [returnRequestProps, setReturnRequestProps] = useState<{
    deliveryId: number;
  }>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<{ dirty: boolean; resetForm: () => void } | null>(null);

  // Estados para la búsqueda de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState(clientSearch);
  const [lastClientSearchTerm, setLastClientSearchTerm] = useState('');
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // Estados para la búsqueda de entregas (después de seleccionar cliente)
  const [selectedDelivery, setSelectedDelivery] = useState<{ id: number; client: string } | null>(null);

  // Hook para obtener entregas confirmadas del cliente seleccionado
  const { data: confirmedDeliveries = [], isLoading: isLoadingDeliveries } = useGetConfirmedDeliveriesByClient(
    selectedClient?.id,
  );

  const { data, isLoading, fieldError } = useAddReturnRequest(returnRequestProps);

  // Debounce para búsqueda de clientes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  // Filtros de búsqueda de clientes
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

  const actualClientFilters = debouncedClientSearch && debouncedClientSearch.length >= 2 ? clientFilters : undefined;
  const { data: clientsSearch = [], isLoading: isLoadingClientsSearch } = useGetClients(1, 10, actualClientFilters);

  // Actualizar el término de búsqueda cuando los datos cambien
  useEffect(() => {
    if (!isLoadingClientsSearch && debouncedClientSearch && debouncedClientSearch.length >= 2) {
      setLastClientSearchTerm(debouncedClientSearch);
    }
  }, [isLoadingClientsSearch, debouncedClientSearch]);

  // Handle click outside to close client dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Funciones para manejar búsqueda de clientes
  const handleClientSearch = (value: string) => {
    setClientSearch(value);
    if (value.length >= 2) {
      setShowClientDropdown(true);
    } else {
      setShowClientDropdown(false);
    }
  };

  const handleClearClientSearch = () => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientDropdown(false);
    // Limpiar entrega seleccionada cuando se deselecciona el cliente
    setSelectedDelivery(null);
  };

  // Handle successful creation
  useEffect(() => {
    if (data && returnRequestProps) {
      setReturnRequests((prev) => [...prev, data]);
      setReturnRequestProps(undefined);
      setSelectedClient(null);
      setSelectedDelivery(null);
      setClientSearch('');
      if (formikInstance) {
        formikInstance.resetForm();
      }
      onClose();
      toast({
        title: 'Devolución creada',
        description: 'La devolución ha sido creada exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [data, returnRequestProps, setReturnRequests, onClose, toast, formikInstance]);

  // Handle errors
  useEffect(() => {
    if (fieldError && returnRequestProps) {
      const errorMessage = fieldError.error || 'Ha ocurrido un error inesperado';
      toast({
        title: 'Error al crear devolución',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      setReturnRequestProps(undefined);
    }
  }, [fieldError, returnRequestProps, toast]);

  const handleClose = () => {
    if (formikInstance?.dirty) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleOverlayClick = () => {
    handleClose();
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
    setSelectedClient(null);
    setSelectedDelivery(null);
    setClientSearch('');
    if (formikInstance) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleSubmit = (values: any) => {
    const formData = {
      deliveryId: selectedDelivery?.id || values.deliveryId,
    };

    setReturnRequestProps(formData);
  };

  const initialValues = {
    deliveryId: '',
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'xl' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
        scrollBehavior="inside"
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
            Nueva devolución
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validate={() => {
                const errors: any = {};

                if (!selectedClient?.id) {
                  errors.client = 'El cliente es requerido';
                }

                if (!selectedDelivery?.id) {
                  errors.deliveryId = 'La entrega es requerida';
                }

                return errors;
              }}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {(formik) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty: formik.dirty, resetForm: formik.resetForm });
                }, [formik.dirty, formik.resetForm]);

                // Revalidar cuando cambie el cliente o la entrega seleccionada
                useEffect(() => {
                  if (formik.submitCount > 0) {
                    formik.validateForm();
                  }
                }, [selectedClient?.id, selectedDelivery?.id, formik.submitCount]);

                return (
                  <>
                    <form id="return-request-form" onSubmit={formik.handleSubmit}>
                      <VStack spacing="1rem" align="stretch">
                        {/* Búsqueda de Cliente */}
                        <FormControl isInvalid={!selectedClient?.id && formik.submitCount > 0}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiUsers} boxSize="1rem" />
                              <Text>Cliente</Text>
                            </HStack>
                          </FormLabel>

                          <Box position="relative" ref={clientSearchRef}>
                            {selectedClient ? (
                              <Flex
                                h="40px"
                                px="0.75rem"
                                bg={inputBg}
                                borderRadius="md"
                                border="1px solid"
                                borderColor={inputBorder}
                                align="center"
                                justify="space-between"
                              >
                                <Text fontSize="sm" noOfLines={1} fontWeight="medium">
                                  {selectedClient.name}
                                </Text>
                                <IconButton
                                  aria-label="Limpiar cliente"
                                  icon={<Text fontSize="sm">✕</Text>}
                                  size="xs"
                                  variant="ghost"
                                  onClick={handleClearClientSearch}
                                  color={textColor}
                                  _hover={{}}
                                  ml="0.5rem"
                                />
                              </Flex>
                            ) : (
                              <Box>
                                <Flex
                                  bg={inputBg}
                                  borderRadius="md"
                                  overflow="hidden"
                                  borderWidth="1px"
                                  borderColor={inputBorder}
                                >
                                  <Select
                                    value={clientSearchType}
                                    onChange={(e) =>
                                      setClientSearchType(
                                        e.target.value as 'name' | 'rut' | 'razonSocial' | 'contactName',
                                      )
                                    }
                                    bg="transparent"
                                    border="none"
                                    color={textColor}
                                    w={{ base: '6rem', md: 'auto' }}
                                    minW={{ base: '6rem', md: '7rem' }}
                                    borderRadius="none"
                                    _focus={{ boxShadow: 'none' }}
                                    fontSize={{ base: 'xs', md: 'sm' }}
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
                                      <AiOutlineSearch color="gray" />
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
                                    maxH="400px"
                                    overflowY="auto"
                                    zIndex={20}
                                  >
                                    {(() => {
                                      const isTyping =
                                        clientSearch !== debouncedClientSearch && clientSearch.length >= 2;
                                      const isSearching =
                                        !isTyping && isLoadingClientsSearch && debouncedClientSearch.length >= 2;
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
                                            {clientsSearch.map((client: any, index: number) => (
                                              <Fragment key={client.id}>
                                                <ListItem
                                                  p="0.75rem"
                                                  cursor="pointer"
                                                  _hover={{ bg: hoverBg }}
                                                  transition="background-color 0.2s ease"
                                                  onClick={() => {
                                                    setSelectedClient({ id: client.id, name: client.name });
                                                    setClientSearch('');
                                                    setShowClientDropdown(false);
                                                  }}
                                                >
                                                  <Box>
                                                    <Text fontSize="sm" fontWeight="medium">
                                                      {client.name}
                                                    </Text>
                                                    <Text fontSize="xs" color={textColor}>
                                                      {client.rut && `RUT: ${client.rut}`}
                                                      {client.contactName && ` - Contacto: ${client.contactName}`}
                                                    </Text>
                                                  </Box>
                                                </ListItem>
                                                {index < clientsSearch.length - 1 && <Divider />}
                                              </Fragment>
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
                            )}
                          </Box>
                          <FormErrorMessage>
                            {!selectedClient?.id && formik.submitCount > 0 && 'El cliente es requerido'}
                          </FormErrorMessage>
                        </FormControl>

                        {/* Selección de Entrega */}
                        <FormControl isInvalid={!selectedDelivery?.id && formik.submitCount > 0 && !!selectedClient}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiTruck} boxSize="1rem" />
                              <Text>Entrega</Text>
                            </HStack>
                          </FormLabel>

                          {selectedClient ? (
                            <Select
                              placeholder={isLoadingDeliveries ? 'Cargando entregas...' : 'Selecciona una entrega...'}
                              value={selectedDelivery?.id || ''}
                              onChange={(e) => {
                                const deliveryId = parseInt(e.target.value);
                                const delivery = confirmedDeliveries.find((d) => d.id === deliveryId);
                                if (delivery) {
                                  setSelectedDelivery({ id: delivery.id, client: delivery.client?.name || '' });
                                  formik.setFieldValue('deliveryId', delivery.id);
                                } else {
                                  setSelectedDelivery(null);
                                  formik.setFieldValue('deliveryId', '');
                                }
                              }}
                              bg={inputBg}
                              borderColor={inputBorder}
                            >
                              {confirmedDeliveries.map((delivery) => (
                                <option key={delivery.id} value={delivery.id}>
                                  #{delivery.id} - {new Date(delivery.date).toLocaleDateString('es-ES')}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <Box
                              px="0.75rem"
                              py="0.5rem"
                              bg={inputBg}
                              borderRadius="md"
                              border="1px solid"
                              borderColor={inputBorder}
                              color={textColor}
                              fontSize="sm"
                              fontStyle="italic"
                            >
                              Primero selecciona un cliente para ver sus entregas disponibles
                            </Box>
                          )}

                          <FormErrorMessage>
                            {!selectedDelivery?.id &&
                              formik.submitCount > 0 &&
                              selectedClient &&
                              'La entrega es requerida'}
                          </FormErrorMessage>
                        </FormControl>
                      </VStack>
                    </form>
                  </>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleOverlayClick} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="return-request-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                leftIcon={<FaCheck />}
                isLoading={isLoading}
                loadingText="Creando..."
                size="sm"
              >
                Crear devolución
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmClose}
      />
    </>
  );
};

export const ReturnRequestAdd = ({ isLoading, setReturnRequests }: ReturnRequestAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hasPermission = useUserStore((state) => state.hasPermission);
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!hasPermission(Permission.CREATE_ORDER_REQUESTS)) {
    return null;
  }

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoading}
      >
        Nuevo
      </Button>

      {isOpen && <ReturnRequestAddModal isOpen={isOpen} onClose={onClose} setReturnRequests={setReturnRequests} />}
    </>
  );
};
