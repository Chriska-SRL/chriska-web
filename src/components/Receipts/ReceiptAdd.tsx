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
  Select,
  NumberInput,
  NumberInputField,
  Textarea,
  Box,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  List,
  ListItem,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiUsers, FiCalendar, FiDollarSign, FiFileText } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useEffect, useState, useRef, Fragment, useMemo, useCallback } from 'react';
import { Receipt } from '@/entities/receipt';
import { useAddReceipt } from '@/hooks/receipt';
import { useGetClients } from '@/hooks/client';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { PaymentMethodOptions } from '@/enums/paymentMethod.enum';

type ReceiptAddProps = {
  isLoading: boolean;
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
};

type ReceiptAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setReceipts: React.Dispatch<React.SetStateAction<Receipt[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const ReceiptAddModal = ({ isOpen, onClose, setReceipts }: ReceiptAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [receiptProps, setReceiptProps] = useState<Partial<Receipt>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  // Estados para la búsqueda de clientes
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{ id: number; name: string } | null>(null);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState(clientSearch);
  const [lastClientSearchTerm, setLastClientSearchTerm] = useState('');
  const clientSearchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, fieldError } = useAddReceipt(receiptProps);

  // Colores y variables de estilo
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

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

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingClientsSearch && debouncedClientSearch && debouncedClientSearch.length >= 2) {
      setLastClientSearchTerm(debouncedClientSearch);
    }
  }, [isLoadingClientsSearch, debouncedClientSearch]);

  // Funciones para manejar búsqueda de clientes
  const handleClientSearch = useCallback((value: string) => {
    setClientSearch(value);
    if (value.length >= 2) {
      setShowClientDropdown(true);
    } else {
      setShowClientDropdown(false);
    }
  }, []);

  const handleClientSelect = useCallback((client: any) => {
    setSelectedClient({ id: client.id, name: client.name });
    setClientSearch('');
    setShowClientDropdown(false);
  }, []);

  const handleClearClientSearch = useCallback(() => {
    setSelectedClient(null);
    setClientSearch('');
    setShowClientDropdown(false);
  }, []);

  // Click outside handler
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
    setReceiptProps(undefined);
    setShowConfirmDialog(false);
    // Limpiar estados de búsqueda de cliente
    setSelectedClient(null);
    setClientSearch('');
    setShowClientDropdown(false);
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
        title: 'Pago creado',
        description: 'El pago ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setReceiptProps(undefined);
      setReceipts((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setReceipts, toast, onClose]);

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

  const handleSubmit = (values: any) => {
    const newReceipt = {
      ...values,
      clientId: selectedClient?.id || 0,
      amount: Number(values.amount),
      date: values.date || new Date().toISOString().split('T')[0],
    };
    setReceiptProps(newReceipt);
  };

  const validateForm = (values: any) => {
    const errors: any = {};

    // Validar cliente seleccionado en lugar del campo del formulario
    if (!selectedClient) errors.clientId = 'Debe seleccionar un cliente';

    const amountError = validateEmpty(values.amount);
    if (amountError) errors.amount = amountError;
    else if (Number(values.amount) <= 0) errors.amount = 'El monto debe ser mayor a 0';

    const paymentMethodError = validateEmpty(values.paymentMethod);
    if (paymentMethodError) errors.paymentMethod = 'Debe seleccionar un método de pago';

    const dateError = validateEmpty(values.date);
    if (dateError) errors.date = dateError;

    return errors;
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
            Nuevo pago
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                clientId: '',
                amount: '',
                paymentMethod: '',
                date: new Date().toISOString().split('T')[0],
                notes: '',
              }}
              onSubmit={handleSubmit}
              validate={validateForm}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="receipt-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field name="clientId">
                        {() => (
                          <FormControl isInvalid={submitCount > 0 && !selectedClient}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiUsers} boxSize="1rem" />
                                <Text>Cliente</Text>
                              </HStack>
                            </FormLabel>

                            {/* Cliente seleccionado */}
                            {selectedClient && (
                              <Flex
                                p="0.5rem"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                borderRadius="md"
                                align="center"
                                justify="space-between"
                                mb="0.5rem"
                              >
                                <Text fontSize="sm">{selectedClient.name}</Text>
                                <IconButton
                                  aria-label="Quitar cliente"
                                  icon={<Text fontSize="lg">×</Text>}
                                  size="xs"
                                  variant="ghost"
                                  onClick={handleClearClientSearch}
                                  isDisabled={isLoading}
                                />
                              </Flex>
                            )}

                            {/* Buscador de clientes */}
                            {!selectedClient && (
                              <Box position="relative" ref={clientSearchRef}>
                                <Flex
                                  bg={inputBg}
                                  borderRadius="md"
                                  overflow="hidden"
                                  border="1px solid"
                                  borderColor={inputBorder}
                                >
                                  <Select
                                    value={clientSearchType}
                                    onChange={(e) => setClientSearchType(e.target.value as any)}
                                    bg="transparent"
                                    border="none"
                                    color={textColor}
                                    w="auto"
                                    minW="7rem"
                                    borderRadius="none"
                                    _focus={{ boxShadow: 'none' }}
                                    isDisabled={isLoading}
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
                                      isDisabled={isLoading}
                                    />
                                    <InputRightElement>
                                      <IconButton
                                        aria-label="Buscar"
                                        icon={<AiOutlineSearch size="1.25rem" />}
                                        size="sm"
                                        variant="ghost"
                                        color={textColor}
                                        onClick={() => setShowClientDropdown(!showClientDropdown)}
                                        isDisabled={isLoading || clientSearch.length < 2}
                                      />
                                    </InputRightElement>
                                  </InputGroup>
                                </Flex>

                                {/* Dropdown de resultados */}
                                {showClientDropdown && (
                                  <Box
                                    position="absolute"
                                    top="100%"
                                    left={0}
                                    right={0}
                                    mt="0.25rem"
                                    bg={dropdownBg}
                                    border="1px solid"
                                    borderColor={dropdownBorder}
                                    borderRadius="md"
                                    boxShadow="lg"
                                    maxH="15rem"
                                    overflowY="auto"
                                    zIndex={1000}
                                  >
                                    {clientSearch.length < 2 ? (
                                      <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                        Escribe al menos 2 caracteres para buscar
                                      </Text>
                                    ) : isLoadingClientsSearch ? (
                                      <Flex justify="center" align="center" p="1rem">
                                        <Spinner size="sm" />
                                        <Text ml="0.5rem" fontSize="sm" color={textColor}>
                                          Buscando clientes...
                                        </Text>
                                      </Flex>
                                    ) : clientsSearch && clientsSearch.length > 0 ? (
                                      <List>
                                        {clientsSearch.map((client, index) => (
                                          <Fragment key={client.id}>
                                            {index > 0 && <Divider />}
                                            <ListItem
                                              p="0.75rem"
                                              cursor="pointer"
                                              _hover={{ bg: hoverBg }}
                                              onClick={() => handleClientSelect(client)}
                                            >
                                              <Text fontSize="sm" fontWeight="medium">
                                                {client.name}
                                              </Text>
                                              {client.rut && (
                                                <Text fontSize="xs" color={textColor}>
                                                  RUT: {client.rut}
                                                </Text>
                                              )}
                                              {client.razonSocial && (
                                                <Text fontSize="xs" color={textColor}>
                                                  Razón Social: {client.razonSocial}
                                                </Text>
                                              )}
                                            </ListItem>
                                          </Fragment>
                                        ))}
                                      </List>
                                    ) : (
                                      <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                        No se encontraron clientes para "{lastClientSearchTerm}"
                                      </Text>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            )}

                            {submitCount > 0 && !selectedClient && (
                              <Text color="red.500" fontSize="sm" mt="0.25rem">
                                Debe seleccionar un cliente
                              </Text>
                            )}
                          </FormControl>
                        )}
                      </Field>

                      <Field name="date">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.date && !!errors.date}>
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
                            <FormErrorMessage>{errors.date}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="amount">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.amount && !!errors.amount}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiDollarSign} boxSize="1rem" />
                                <Text>Monto</Text>
                              </HStack>
                            </FormLabel>
                            <NumberInput min={0} precision={2}>
                              <NumberInputField
                                {...field}
                                placeholder="Ingrese el monto"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                            </NumberInput>
                            <FormErrorMessage>{errors.amount}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="paymentMethod">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.paymentMethod && !!errors.paymentMethod}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Método de pago</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar método de pago"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            >
                              {PaymentMethodOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.paymentMethod}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="notes">
                        {({ field }: any) => (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <Text>Notas</Text>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese notas adicionales (opcional)"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={3}
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
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="receipt-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear pago
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
export const ReceiptAdd = ({ isLoading: isLoadingReceipts, setReceipts }: ReceiptAddProps) => {
  const canCreateReceipts = useUserStore((s) => s.hasPermission(Permission.CREATE_RECEIPTS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateReceipts) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingReceipts}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <ReceiptAddModal isOpen={isOpen} onClose={onClose} setReceipts={setReceipts} />}
    </>
  );
};
