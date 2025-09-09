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
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { FiUsers, FiCalendar, FiFileText, FiEdit, FiShoppingCart } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useEffect, useState, useRef, Fragment, useMemo, useCallback } from 'react';
import { Purchase } from '@/entities/purchase';
import { useAddPurchase } from '@/hooks/purchase';
import { useGetSuppliers } from '@/hooks/supplier';
import { useGetProducts } from '@/hooks/product';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type PurchaseAddProps = {
  isLoading: boolean;
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
};

type PurchaseAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setPurchases: React.Dispatch<React.SetStateAction<Purchase[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const PurchaseAddModal = ({ isOpen, onClose, setPurchases }: PurchaseAddModalProps) => {
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

  // Estados para productos seleccionados
  const [selectedProducts, setSelectedProducts] = useState<
    Array<{
      id: number;
      name: string;
      quantity: number;
      weight: number;
      unitPrice: number;
      discount: number;
    }>
  >([]);

  // Estados para búsqueda de productos
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [debouncedProductSearch, setDebouncedProductSearch] = useState(productSearch);
  const [lastProductSearchTerm, setLastProductSearchTerm] = useState('');
  const productSearchRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, error, fieldError, mutate } = useAddPurchase();

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

  // Filtros de búsqueda de productos
  const productFilters = useMemo(() => {
    if (!debouncedProductSearch || debouncedProductSearch.length < 2) return undefined;
    const filters: any = {};
    switch (productSearchType) {
      case 'name':
        filters.name = debouncedProductSearch;
        break;
      case 'internalCode':
        filters.internalCode = debouncedProductSearch;
        break;
    }
    return filters;
  }, [debouncedProductSearch, productSearchType]);

  const actualProductFilters =
    debouncedProductSearch && debouncedProductSearch.length >= 2 ? productFilters : undefined;
  const { data: productsSearch = [], isLoading: isLoadingProductsSearch } = useGetProducts(1, 10, actualProductFilters);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingSuppliersSearch && debouncedSupplierSearch && debouncedSupplierSearch.length >= 2) {
      setLastSupplierSearchTerm(debouncedSupplierSearch);
    }
  }, [isLoadingSuppliersSearch, debouncedSupplierSearch]);

  // Debounce para búsqueda de productos
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [productSearch]);

  // Update product search term
  useEffect(() => {
    if (!isLoadingProductsSearch && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastProductSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProductsSearch, debouncedProductSearch]);

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

  // Clear products when supplier changes
  useEffect(() => {
    if (!selectedSupplier) {
      setSelectedProducts([]);
    }
  }, [selectedSupplier]);

  // Funciones para manejar búsqueda de productos
  const handleProductSearch = useCallback((value: string) => {
    setProductSearch(value);
    if (value.length >= 2) {
      setShowProductDropdown(true);
    } else {
      setShowProductDropdown(false);
    }
  }, []);

  const handleProductSelect = useCallback(
    (product: any) => {
      const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
      if (!isAlreadySelected) {
        setSelectedProducts((prev) => [
          ...prev,
          {
            id: product.id,
            name: product.name,
            quantity: 1,
            weight: 0,
            unitPrice: 0,
            discount: 0,
          },
        ]);
        setProductSearch('');
        setShowProductDropdown(false);
      }
    },
    [selectedProducts],
  );

  const handleRemoveProduct = useCallback((productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const handleProductFieldChange = useCallback((productId: number, field: string, value: number) => {
    setSelectedProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, [field]: value } : p)));
  }, []);

  // Click outside handler for supplier dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (supplierSearchRef.current && !supplierSearchRef.current.contains(event.target as Node)) {
        setShowSupplierDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside handler for product dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (productSearchRef.current && !productSearchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return selectedProducts.reduce((total, product) => {
      const subtotal = product.quantity * product.unitPrice * (1 - product.discount / 100);
      return total + subtotal;
    }, 0);
  }, [selectedProducts]);

  const handleClose = () => {
    setShowConfirmDialog(false);
    // Clear supplier states
    setSelectedSupplier(null);
    setSupplierSearch('');
    setShowSupplierDropdown(false);
    // Clear product states
    setSelectedProducts([]);
    setProductSearch('');
    setShowProductDropdown(false);
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
        title: 'Factura creada',
        description: 'La factura ha sido creada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setPurchases((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setPurchases, toast, onClose]);

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
    // Validar que hay productos seleccionados
    if (selectedProducts.length === 0) {
      return; // No enviar si no hay productos
    }

    // Validar que todos los productos tienen datos válidos
    for (const product of selectedProducts) {
      if (product.quantity <= 0 || product.unitPrice <= 0) {
        toast({
          title: 'Error en productos',
          description: 'Todos los productos deben tener cantidad y precio unitario mayor a 0',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const newPurchase = {
      ...values,
      supplierId: selectedSupplier?.id || 0,
      date: values.date || new Date().toISOString(),
      productItems: selectedProducts.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
        weight: p.weight,
        unitPrice: p.unitPrice,
        discount: p.discount,
      })),
    };
    await mutate(newPurchase);
  };

  const validateForm = (values: any) => {
    const errors: any = {};

    // Validate supplier
    if (!selectedSupplier) errors.supplierId = 'Debe seleccionar un proveedor';

    // Validate invoice number
    const invoiceNumberError = validateEmpty(values.invoiceNumber);
    if (invoiceNumberError) errors.invoiceNumber = invoiceNumberError;

    // Validate date
    const dateError = validateEmpty(values.date);
    if (dateError) errors.date = dateError;

    // Products validation is handled separately in UI
    // since productItems is not part of Formik form structure

    return errors;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'xl' }}
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
            Nueva factura
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                supplierId: '',
                invoiceNumber: '',
                date: new Date().toISOString().split('T')[0],
                observations: '',
              }}
              onSubmit={handleSubmit}
              validate={validateForm}
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="purchase-add-form" onSubmit={handleSubmit}>
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

                      <Field name="invoiceNumber">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.invoiceNumber && !!errors.invoiceNumber}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Número de factura</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el número de factura"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.invoiceNumber}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      {/* Sección de productos */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiShoppingCart} boxSize="1rem" />
                            <Text>Productos</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>

                        {/* Mostrar mensaje si no hay proveedor seleccionado */}
                        {!selectedSupplier ? (
                          <Flex
                            justifyContent="center"
                            alignItems="center"
                            h="2.5rem"
                            bg={inputBg}
                            borderRadius="md"
                            border="1px solid"
                            borderColor={inputBorder}
                          >
                            <Text fontSize="sm" color={textColor} textAlign="center">
                              Seleccione un proveedor antes de agregar productos
                            </Text>
                          </Flex>
                        ) : (
                          <>
                            {/* Buscador de productos */}
                            <Box position="relative" ref={productSearchRef}>
                              <Flex
                                bg={inputBg}
                                borderRadius="md"
                                overflow="hidden"
                                border="1px solid"
                                borderColor={inputBorder}
                              >
                                <Select
                                  value={productSearchType}
                                  onChange={(e) => setProductSearchType(e.target.value as 'name' | 'internalCode')}
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
                                  <option value="internalCode">Cód. interno</option>
                                </Select>

                                <Box w="1px" bg={dividerColor} alignSelf="stretch" my="0.5rem" />

                                <InputGroup flex="1">
                                  <Input
                                    placeholder="Buscar producto..."
                                    value={productSearch}
                                    onChange={(e) => handleProductSearch(e.target.value)}
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
                                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                                      isDisabled={isLoading || productSearch.length < 2}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </Flex>

                              {/* Dropdown de resultados de productos */}
                              {showProductDropdown && (
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
                                      productSearch !== debouncedProductSearch && productSearch.length >= 2;
                                    const isSearching =
                                      !isTyping && isLoadingProductsSearch && debouncedProductSearch.length >= 2;
                                    const searchCompleted =
                                      !isTyping &&
                                      !isSearching &&
                                      debouncedProductSearch.length >= 2 &&
                                      lastProductSearchTerm === debouncedProductSearch;

                                    if (isTyping || isSearching) {
                                      return (
                                        <Flex justify="center" align="center" p="1rem" gap="0.5rem">
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color={textColor}>
                                            Buscando productos...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    if (searchCompleted && productsSearch && productsSearch.length > 0) {
                                      return (
                                        <List>
                                          {productsSearch.map((product, index) => {
                                            const isSelected = selectedProducts.some((p) => p.id === product.id);
                                            return (
                                              <Fragment key={product.id}>
                                                <ListItem
                                                  p="0.75rem"
                                                  cursor="pointer"
                                                  _hover={{ bg: hoverBg }}
                                                  opacity={isSelected ? 0.5 : 1}
                                                  onClick={() => !isSelected && handleProductSelect(product)}
                                                >
                                                  <Text fontSize="sm" fontWeight="medium">
                                                    {product.name}
                                                  </Text>
                                                  <Text fontSize="xs" color={textColor}>
                                                    Precio: ${product.price || 0}
                                                    {product.internalCode && ` - Cód: ${product.internalCode}`}
                                                  </Text>
                                                  {isSelected && (
                                                    <Text fontSize="xs" color="green.500">
                                                      Seleccionado
                                                    </Text>
                                                  )}
                                                </ListItem>
                                                {index < productsSearch.length - 1 && <Divider />}
                                              </Fragment>
                                            );
                                          })}
                                        </List>
                                      );
                                    }

                                    if (searchCompleted && productsSearch && productsSearch.length === 0) {
                                      return (
                                        <Text p="1rem" fontSize="sm" color={textColor} textAlign="center">
                                          No se encontraron productos
                                        </Text>
                                      );
                                    }

                                    if (productSearch.length < 2) {
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

                            {submitCount > 0 && selectedProducts.length === 0 && (
                              <Text color="red.500" fontSize="sm" mt="0.5rem">
                                Debe agregar al menos un producto
                              </Text>
                            )}

                            {/* Lista de productos seleccionados */}
                            {selectedProducts.length > 0 && (
                              <Box mt="1rem">
                                <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                                  Productos seleccionados ({selectedProducts.length}):
                                </Text>
                                <VStack spacing="0.5rem" align="stretch">
                                  {selectedProducts.map((product) => {
                                    const subtotal =
                                      product.quantity * product.unitPrice * (1 - product.discount / 100);
                                    return (
                                      <Box
                                        key={product.id}
                                        p={{ base: '1rem', md: '0.75rem' }}
                                        border="1px solid"
                                        borderColor={inputBorder}
                                        borderRadius="md"
                                        bg={inputBg}
                                      >
                                        {/* Desktop Layout - Dos filas */}
                                        <Box display={{ base: 'none', md: 'block' }}>
                                          {/* Primera fila: Imagen, Nombre y Botón eliminar */}
                                          <Flex align="center" gap="1rem" mb="0.75rem">
                                            {/* Imagen */}
                                            <Image
                                              src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                                              alt={product.name}
                                              boxSize="50px"
                                              objectFit="cover"
                                              borderRadius="md"
                                              flexShrink={0}
                                            />

                                            {/* Nombre */}
                                            <Box flex="1">
                                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                {product.name}
                                              </Text>
                                            </Box>

                                            {/* Delete Button */}
                                            <IconButton
                                              aria-label="Eliminar producto"
                                              icon={<FaTrash />}
                                              size="sm"
                                              colorScheme="red"
                                              variant="ghost"
                                              onClick={() => handleRemoveProduct(product.id)}
                                              flexShrink={0}
                                            />
                                          </Flex>

                                          {/* Segunda fila: Inputs y Subtotal */}
                                          <Flex align="center" justify="space-around">
                                            {/* Quantity Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Cantidad
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.quantity}
                                                min={1}
                                                max={9999}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 1;
                                                  handleProductFieldChange(product.id, 'quantity', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Weight Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Peso (g)
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.weight}
                                                min={0}
                                                precision={0}
                                                step={1}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'weight', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Unit Price Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Precio
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.unitPrice}
                                                min={0}
                                                precision={2}
                                                step={0.01}
                                                onChange={(valueString) => {
                                                  const value = parseFloat(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'unitPrice', value);
                                                }}
                                                w="6rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Discount Input */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Descuento %
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.discount}
                                                min={0}
                                                max={100}
                                                precision={1}
                                                step={0.1}
                                                onChange={(valueString) => {
                                                  const value = parseFloat(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'discount', value);
                                                }}
                                                w="4rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>

                                            {/* Subtotal */}
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor} textAlign="center">
                                                Subtotal
                                              </Text>
                                              <Text fontSize="md" fontWeight="bold" textAlign="center">
                                                ${subtotal.toFixed(2)}
                                              </Text>
                                            </VStack>
                                          </Flex>
                                        </Box>

                                        {/* Mobile Layout - Tres filas */}
                                        <Box display={{ base: 'block', md: 'none' }} position="relative">
                                          {/* Delete button - absolute position top right */}
                                          <IconButton
                                            aria-label="Eliminar producto"
                                            icon={<FaTrash />}
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            onClick={() => handleRemoveProduct(product.id)}
                                            position="absolute"
                                            top="-0.5rem"
                                            right="-0.5rem"
                                            zIndex={1}
                                          />

                                          {/* Primera fila: Image + Name */}
                                          <Flex align="center" gap="0.75rem" mb="0.75rem" pr="3rem">
                                            <Image
                                              src={'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'}
                                              alt={product.name}
                                              boxSize="50px"
                                              objectFit="cover"
                                              borderRadius="md"
                                              flexShrink={0}
                                            />
                                            <Box flex="1">
                                              <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                                                {product.name}
                                              </Text>
                                            </Box>
                                          </Flex>

                                          {/* Segunda fila: Cantidad y Peso */}
                                          <Flex justify="space-between" align="center" mb="0.75rem">
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor}>
                                                Cantidad
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.quantity}
                                                min={1}
                                                max={9999}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 1;
                                                  handleProductFieldChange(product.id, 'quantity', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>
                                            <VStack spacing="0.25rem" align="center">
                                              <Text fontSize="xs" color={textColor}>
                                                Peso (g)
                                              </Text>
                                              <NumberInput
                                                size="sm"
                                                value={product.weight}
                                                min={0}
                                                precision={0}
                                                step={1}
                                                onChange={(valueString) => {
                                                  const value = parseInt(valueString) || 0;
                                                  handleProductFieldChange(product.id, 'weight', value);
                                                }}
                                                w="5rem"
                                              >
                                                <NumberInputField />
                                                <NumberInputStepper>
                                                  <NumberIncrementStepper />
                                                  <NumberDecrementStepper />
                                                </NumberInputStepper>
                                              </NumberInput>
                                            </VStack>
                                          </Flex>

                                          {/* Tercera fila: Precio, Descuento y Subtotal */}
                                          <VStack spacing="0.75rem" align="stretch">
                                            <Flex justify="space-between" align="center">
                                              <VStack spacing="0.25rem" align="center">
                                                <Text fontSize="xs" color={textColor}>
                                                  Precio
                                                </Text>
                                                <NumberInput
                                                  size="sm"
                                                  value={product.unitPrice}
                                                  min={0}
                                                  precision={2}
                                                  step={0.01}
                                                  onChange={(valueString) => {
                                                    const value = parseFloat(valueString) || 0;
                                                    handleProductFieldChange(product.id, 'unitPrice', value);
                                                  }}
                                                  w="6rem"
                                                >
                                                  <NumberInputField />
                                                  <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                  </NumberInputStepper>
                                                </NumberInput>
                                              </VStack>
                                              <VStack spacing="0.25rem" align="center">
                                                <Text fontSize="xs" color={textColor}>
                                                  Descuento %
                                                </Text>
                                                <NumberInput
                                                  size="sm"
                                                  value={product.discount}
                                                  min={0}
                                                  max={100}
                                                  precision={1}
                                                  step={0.1}
                                                  onChange={(valueString) => {
                                                    const value = parseFloat(valueString) || 0;
                                                    handleProductFieldChange(product.id, 'discount', value);
                                                  }}
                                                  w="4rem"
                                                >
                                                  <NumberInputField />
                                                  <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                  </NumberInputStepper>
                                                </NumberInput>
                                              </VStack>
                                            </Flex>

                                            <Box textAlign="center">
                                              <Text fontSize="sm" color={textColor}>
                                                Subtotal
                                              </Text>
                                              <Text fontSize="md" fontWeight="bold">
                                                ${subtotal.toFixed(2)}
                                              </Text>
                                            </Box>
                                          </VStack>
                                        </Box>
                                      </Box>
                                    );
                                  })}
                                </VStack>

                                {/* Total */}
                                <Box>
                                  <Divider mt="1rem" mb="0.5rem" />
                                  <HStack justify="space-between">
                                    <Text fontSize="md" fontWeight="semibold">
                                      Total:
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold">
                                      ${totalAmount.toFixed(2)}
                                    </Text>
                                  </HStack>
                                </Box>
                              </Box>
                            )}
                          </>
                        )}
                      </FormControl>

                      {/* Campo de observaciones al final */}
                      <Field name="observations">
                        {({ field }: any) => (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiEdit} boxSize="1rem" />
                                <Text>Observaciones</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese observaciones adicionales "
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
                form="purchase-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear factura
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
export const PurchaseAdd = ({ isLoading: isLoadingPurchases, setPurchases }: PurchaseAddProps) => {
  const canCreatePurchases = useUserStore((s) => s.hasPermission(Permission.CREATE_PURCHASES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreatePurchases) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingPurchases}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <PurchaseAddModal isOpen={isOpen} onClose={onClose} setPurchases={setPurchases} />}
    </>
  );
};
