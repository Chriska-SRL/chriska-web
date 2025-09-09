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
import { SupplierReceipt } from '@/entities/supplierReceipt';
import { useAddSupplierReceipt } from '@/hooks/supplierReceipt';
import { useGetSuppliers } from '@/hooks/supplier';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { PaymentMethodOptions } from '@/enums/paymentMethod.enum';

type SupplierReceiptAddProps = {
  isLoading: boolean;
  setReceipts: React.Dispatch<React.SetStateAction<SupplierReceipt[]>>;
};

type SupplierReceiptAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setReceipts: React.Dispatch<React.SetStateAction<SupplierReceipt[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const SupplierReceiptAddModal = ({ isOpen, onClose, setReceipts }: SupplierReceiptAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  // Estados para la búsqueda de proveedores
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSearchType, setSupplierSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<{ id: number; name: string } | null>(null);
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState(supplierSearch);
  const [lastSupplierSearchTerm, setLastSupplierSearchTerm] = useState('');
  const supplierSearchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, fieldError, mutate } = useAddSupplierReceipt();

  // Colores y variables de estilo
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  // Debounce para búsqueda de proveedores
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [supplierSearch]);

  // Filtros de búsqueda de proveedores
  const supplierFilters = useMemo(() => {
    if (!debouncedSupplierSearch || debouncedSupplierSearch.length < 2) return undefined;
    const filters: any = {};
    switch (supplierSearchType) {
      case 'name':
        filters.name = debouncedSupplierSearch;
        break;
      case 'rut':
        filters.rut = debouncedSupplierSearch;
        break;
      case 'razonSocial':
        filters.razonSocial = debouncedSupplierSearch;
        break;
      case 'contactName':
        filters.contactName = debouncedSupplierSearch;
        break;
    }
    return filters;
  }, [debouncedSupplierSearch, supplierSearchType]);

  const actualSupplierFilters =
    debouncedSupplierSearch && debouncedSupplierSearch.length >= 2 ? supplierFilters : undefined;
  const { data: suppliersSearch = [], isLoading: isLoadingSuppliersSearch } = useGetSuppliers(
    1,
    10,
    actualSupplierFilters,
  );

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingSuppliersSearch && debouncedSupplierSearch && debouncedSupplierSearch.length >= 2) {
      setLastSupplierSearchTerm(debouncedSupplierSearch);
    }
  }, [isLoadingSuppliersSearch, debouncedSupplierSearch]);

  // Funciones para manejar búsqueda de proveedores
  const handleSupplierSearch = useCallback((value: string) => {
    setSupplierSearch(value);
    if (value.length >= 2) {
      setShowSupplierDropdown(true);
    } else {
      setShowSupplierDropdown(false);
    }
  }, []);

  const handleSupplierSelect = useCallback((supplier: any) => {
    setSelectedSupplier({ id: supplier.id, name: supplier.name });
    setSupplierSearch('');
    setShowSupplierDropdown(false);
  }, []);

  const handleClearSupplierSearch = useCallback(() => {
    setSelectedSupplier(null);
    setSupplierSearch('');
    setShowSupplierDropdown(false);
  }, []);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supplierSearchRef.current && !supplierSearchRef.current.contains(event.target as Node)) {
        setShowSupplierDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClose = () => {
    setShowConfirmDialog(false);
    // Limpiar estados de búsqueda de proveedor
    setSelectedSupplier(null);
    setSupplierSearch('');
    setShowSupplierDropdown(false);
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
        title: 'Pago a proveedor creado',
        description: 'El pago a proveedor ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
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

  const handleSubmit = async (values: any) => {
    const newReceipt = {
      ...values,
      supplierId: selectedSupplier?.id || 0,
      amount: Number(values.amount),
      date: values.date || new Date().toISOString().split('T')[0],
    };
    await mutate(newReceipt);
  };

  const validateForm = (values: any) => {
    const errors: any = {};

    // Validar proveedor seleccionado en lugar del campo del formulario
    if (!selectedSupplier) errors.supplierId = 'Debe seleccionar un proveedor';

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
        size={{ base: 'full', md: 'md' }}
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
            Nuevo pago a proveedor
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                supplierId: '',
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
                      <Field name="supplierId">
                        {() => (
                          <FormControl isInvalid={submitCount > 0 && !selectedSupplier}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiUsers} boxSize="1rem" />
                                <Text>Proveedor</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>

                            {/* Proveedor seleccionado */}
                            {selectedSupplier && (
                              <Flex
                                p="0.5rem 1rem"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                borderRadius="md"
                                align="center"
                                justify="space-between"
                              >
                                <Text>{selectedSupplier.name}</Text>
                                <IconButton
                                  aria-label="Quitar proveedor"
                                  icon={<Text fontSize="lg">×</Text>}
                                  size="xs"
                                  variant="ghost"
                                  onClick={handleClearSupplierSearch}
                                  isDisabled={isLoading}
                                />
                              </Flex>
                            )}

                            {/* Buscador de proveedores */}
                            {!selectedSupplier && (
                              <Box position="relative" ref={supplierSearchRef}>
                                <Flex
                                  bg={inputBg}
                                  borderRadius="md"
                                  overflow="hidden"
                                  border="1px solid"
                                  borderColor={inputBorder}
                                >
                                  <Select
                                    value={supplierSearchType}
                                    onChange={(e) => setSupplierSearchType(e.target.value as any)}
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
                                      placeholder="Buscar proveedor..."
                                      value={supplierSearch}
                                      onChange={(e) => handleSupplierSearch(e.target.value)}
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
                                        onClick={() => setShowSupplierDropdown(!showSupplierDropdown)}
                                        isDisabled={isLoading || supplierSearch.length < 2}
                                      />
                                    </InputRightElement>
                                  </InputGroup>
                                </Flex>

                                {/* Dropdown de resultados */}
                                {showSupplierDropdown && (
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
                                    {(() => {
                                      const isTyping =
                                        supplierSearch !== debouncedSupplierSearch && supplierSearch.length >= 2;
                                      const isSearching =
                                        !isTyping && isLoadingSuppliersSearch && debouncedSupplierSearch.length >= 2;
                                      const searchCompleted =
                                        !isTyping &&
                                        !isSearching &&
                                        debouncedSupplierSearch.length >= 2 &&
                                        lastSupplierSearchTerm === debouncedSupplierSearch;

                                      if (isTyping || isSearching) {
                                        return (
                                          <Flex justify="center" align="center" p="1rem" gap="0.5rem">
                                            <Spinner size="sm" />
                                            <Text fontSize="sm" color={textColor}>
                                              Buscando proveedores...
                                            </Text>
                                          </Flex>
                                        );
                                      }

                                      if (searchCompleted && suppliersSearch && suppliersSearch.length > 0) {
                                        return (
                                          <List>
                                            {suppliersSearch.map((supplier, index) => (
                                              <Fragment key={supplier.id}>
                                                <ListItem
                                                  p="0.75rem"
                                                  cursor="pointer"
                                                  _hover={{ bg: hoverBg }}
                                                  onClick={() => handleSupplierSelect(supplier)}
                                                >
                                                  <Text fontSize="sm" fontWeight="medium">
                                                    {supplier.name}
                                                  </Text>
                                                  <Text fontSize="xs" color={textColor}>
                                                    {supplier.rut && `RUT: ${supplier.rut}`}
                                                    {supplier.contactName && ` - Contacto: ${supplier.contactName}`}
                                                  </Text>
                                                </ListItem>
                                                {index < suppliersSearch.length - 1 && <Divider />}
                                              </Fragment>
                                            ))}
                                          </List>
                                        );
                                      }

                                      if (searchCompleted && suppliersSearch && suppliersSearch.length === 0) {
                                        return (
                                          <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                            No se encontraron proveedores
                                          </Text>
                                        );
                                      }

                                      if (supplierSearch.length < 2) {
                                        return (
                                          <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                            Escribe al menos 2 caracteres para buscar
                                          </Text>
                                        );
                                      }

                                      return null;
                                    })()}
                                  </Box>
                                )}
                              </Box>
                            )}

                            {submitCount > 0 && !selectedSupplier && (
                              <Text color="red.500" fontSize="sm" mt="0.25rem">
                                Debe seleccionar un proveedor
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
                                <Text color="red.500">*</Text>
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
                                <Text color="red.500">*</Text>
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
                                <Text color="red.500">*</Text>
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
                              placeholder="Ingrese notas adicionales"
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
                Crear pago a proveedor
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
export const SupplierReceiptAdd = ({ isLoading: isLoadingReceipts, setReceipts }: SupplierReceiptAddProps) => {
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
      {isOpen && <SupplierReceiptAddModal isOpen={isOpen} onClose={onClose} setReceipts={setReceipts} />}
    </>
  );
};
