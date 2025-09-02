'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  Box,
  useToast,
  Select,
  useDisclosure,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
  InputGroup,
  InputRightElement,
  IconButton,
  List,
  ListItem,
  Image,
  Flex,
  Icon,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { FaPlus, FaTimes, FaCheck } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiPercent, FiCalendar, FiPackage, FiMapPin, FiTag, FiFileText, FiGrid } from 'react-icons/fi';
import { Field, Formik } from 'formik';
import { useEffect, useState, useMemo, useRef, Fragment, useCallback } from 'react';
import { Discount } from '@/entities/discount';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { useAddDiscount } from '@/hooks/discount';
import { useGetProducts } from '@/hooks/product';
import { useGetClients } from '@/hooks/client';
import { useGetBrands } from '@/hooks/brand';
import { useGetCategories } from '@/hooks/category';
import { useGetSubCategories } from '@/hooks/subcategory';
import { useGetZones } from '@/hooks/zone';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type DiscountAddProps = {
  isLoading: boolean;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
};

type DiscountAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
};

const DiscountAddModal = ({ isOpen, onClose, setDiscounts }: DiscountAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  const { data, isLoading, error, fieldError, mutate } = useAddDiscount();

  // Load data using hooks - they handle caching internally
  const { data: brands = [] } = useGetBrands();
  const { data: categories = [] } = useGetCategories();
  const { data: subCategories = [] } = useGetSubCategories();
  const { data: zones = [] } = useGetZones();

  // Estados para productos
  const [productType, setProductType] = useState<'all' | 'brand' | 'subcategory' | 'list'>('all');
  const [selectedBrandId, setSelectedBrandId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>('');

  // Estados para la búsqueda de productos (solo cuando productType === 'list')
  const [productSearch, setProductSearch] = useState('');
  const [productSearchType, setProductSearchType] = useState<'name' | 'internalCode' | 'barcode'>('name');
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Array<{ id: number; name: string; imageUrl?: string }>>([]);
  const [lastProductSearchTerm, setLastProductSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Estados para clientes
  const [clientType, setClientType] = useState<'all' | 'zone' | 'list'>('all');
  const [selectedZoneId, setSelectedZoneId] = useState<string>('');

  // Estados para la búsqueda de clientes (solo cuando clientType === 'list')
  const [clientSearch, setClientSearch] = useState('');
  const [clientSearchType, setClientSearchType] = useState<'name' | 'rut' | 'razonSocial' | 'contactName'>('name');
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClients, setSelectedClients] = useState<
    Array<{ id: number; name: string; rut?: string; contactName?: string }>
  >([]);
  const [lastClientSearchTerm, setLastClientSearchTerm] = useState('');
  const clientSearchRef = useRef<HTMLDivElement>(null);

  // Simple debounce implementation
  const [debouncedProductSearch, setDebouncedProductSearch] = useState(productSearch);
  const [debouncedClientSearch, setDebouncedClientSearch] = useState(clientSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedProductSearch(productSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [productSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedClientSearch(clientSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [clientSearch]);

  const productFilters = useMemo(() => {
    if (productType !== 'list' || !debouncedProductSearch || debouncedProductSearch.length < 2) return undefined;

    return {
      ...(productSearchType === 'name' && { name: debouncedProductSearch }),
      ...(productSearchType === 'internalCode' && { internalCode: debouncedProductSearch }),
      ...(productSearchType === 'barcode' && { barcode: debouncedProductSearch }),
    };
  }, [debouncedProductSearch, productSearchType, productType]);

  const clientFilters = useMemo(() => {
    if (clientType !== 'list' || !debouncedClientSearch || debouncedClientSearch.length < 2) return undefined;
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
  }, [debouncedClientSearch, clientSearchType, clientType]);

  // Filtrar subcategorías por categoría seleccionada
  const filteredSubCategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return subCategories.filter((sub) => sub.category.id === parseInt(selectedCategoryId));
  }, [subCategories, selectedCategoryId]);

  // Solo hacer la llamada si tenemos filtros válidos y estamos en modo lista
  const shouldSearchProducts = productType === 'list' && productFilters !== undefined;
  const shouldSearchClients = clientType === 'list' && clientFilters !== undefined;

  // Solo buscar cuando realmente hay búsqueda activa (el modal ya está abierto)
  const actualProductFilters =
    shouldSearchProducts && debouncedProductSearch && debouncedProductSearch.length >= 2 ? productFilters : undefined;
  const actualClientFilters =
    shouldSearchClients && debouncedClientSearch && debouncedClientSearch.length >= 2 ? clientFilters : undefined;

  // Usar hooks para búsqueda (solo se ejecutan cuando hay filtros válidos)
  const { data: products = [], isLoading: isLoadingProducts } = useGetProducts(1, 10, actualProductFilters);

  const { data: clientsSearch = [], isLoading: isLoadingClientsSearch } = useGetClients(1, 10, actualClientFilters);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingProducts && debouncedProductSearch && debouncedProductSearch.length >= 2) {
      setLastProductSearchTerm(debouncedProductSearch);
    }
  }, [isLoadingProducts, debouncedProductSearch]);

  useEffect(() => {
    if (!isLoadingClientsSearch && debouncedClientSearch && debouncedClientSearch.length >= 2) {
      setLastClientSearchTerm(debouncedClientSearch);
    }
  }, [isLoadingClientsSearch, debouncedClientSearch]);

  // Funciones para manejar productos
  const handleProductSearch = (value: string) => {
    setProductSearch(value);
    if (value.length >= 2) {
      setShowProductDropdown(true);
    } else {
      setShowProductDropdown(false);
    }
  };

  const handleProductSelect = (product: any) => {
    const isAlreadySelected = selectedProducts.some((p) => p.id === product.id);
    if (!isAlreadySelected) {
      setSelectedProducts((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl,
        },
      ]);
    }
    setProductSearch('');
    setShowProductDropdown(false);
  };

  const handleRemoveProduct = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearProductSearch = () => {
    setProductSearch('');
    setShowProductDropdown(false);
  };

  // Funciones para manejar clientes
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
  };

  const handleRemoveClient = (clientId: number) => {
    setSelectedClients((prev) => prev.filter((c) => c.id !== clientId));
  };

  const handleClearClientSearch = () => {
    setClientSearch('');
    setShowClientDropdown(false);
  };

  const handleClose = () => {
    setProductType('all');
    setSelectedBrandId('');
    setSelectedCategoryId('');
    setSelectedSubCategoryId('');
    setSelectedZoneId('');
    setClientType('all');
    setSelectedProducts([]);
    setSelectedClients([]);
    setProductSearch('');
    setClientSearch('');
    setShowProductDropdown(false);
    setShowClientDropdown(false);
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

  // Success useEffect following ProductAdd pattern
  useEffect(() => {
    if (data) {
      toast({
        title: 'Descuento creado',
        description: 'El descuento ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setDiscounts((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setDiscounts, toast, onClose]);

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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
      if (clientSearchRef.current && !clientSearchRef.current.contains(event.target as Node)) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    async (values: { description: string; expirationDate: string; productQuantity: number; percentage: number }) => {
      // Prevent double submission
      if (isLoading) return;

      // Create the discount object with only necessary fields
      const discount: any = {
        description: values.description,
        expirationDate: values.expirationDate,
        productQuantity: values.productQuantity,
        percentage: values.percentage,
        status: 'Available',
      };

      // Add product-related fields only when necessary
      if (productType === 'brand' && selectedBrandId) {
        discount.brandId = selectedBrandId;
      } else if (productType === 'subcategory' && selectedSubCategoryId) {
        discount.subCategoryId = selectedSubCategoryId;
      } else if (productType === 'list') {
        discount.discountProductId = selectedProducts.map((p) => p.id);
      }
      // If productType === 'all', don't send any product-related fields

      // Add client-related fields only when necessary
      if (clientType === 'zone' && selectedZoneId) {
        discount.zoneId = selectedZoneId;
      } else if (clientType === 'list') {
        discount.discountClientId = selectedClients.map((c) => c.id);
      }
      // If clientType === 'all', don't send any client-related fields

      await mutate(discount);
    },
    [
      isLoading,
      productType,
      selectedProducts,
      clientType,
      selectedClients,
      selectedBrandId,
      selectedSubCategoryId,
      selectedZoneId,
      mutate,
    ],
  );

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
            Nuevo descuento
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                description: '',
                expirationDate: '',
                productQuantity: 1,
                percentage: 0,
                brandId: '',
                subCategoryId: '',
                zoneId: '',
              }}
              onSubmit={handleSubmit}
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="discount-add-form" onSubmit={handleSubmit}>
                    <Box>
                      <VStack spacing="1rem" align="stretch">
                        <Stack spacing="1rem" w="100%" direction={{ base: 'column', md: 'row' }}>
                          <Field name="percentage" validate={validateEmpty}>
                            {({ field }: any) => (
                              <FormControl
                                isInvalid={submitCount > 0 && touched.percentage && !!errors.percentage}
                                flex="1"
                              >
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiPercent} boxSize="1rem" />
                                    <Text>Porcentaje (%)</Text>
                                    <Text color="red.500">*</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  {...field}
                                  type="number"
                                  min={0}
                                  max={100}
                                  step={0.01}
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  placeholder="0.00"
                                  disabled={isLoading}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    // Permitir valores vacíos para poder escribir
                                    if (value === '') {
                                      setFieldValue('percentage', '');
                                      return;
                                    }
                                    // Convertir a número y validar rango
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                                      setFieldValue('percentage', numValue);
                                    } else if (!isNaN(numValue)) {
                                      // Si está fuera del rango, limitar
                                      setFieldValue('percentage', Math.max(0, Math.min(100, numValue)));
                                    }
                                  }}
                                />
                                <FormErrorMessage>{errors.percentage}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Field name="productQuantity" validate={validateEmpty}>
                            {({ field }: any) => (
                              <FormControl
                                isInvalid={submitCount > 0 && touched.productQuantity && !!errors.productQuantity}
                                flex="1"
                              >
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiPackage} boxSize="1rem" />
                                    <Text>Cantidad mínima</Text>
                                    <Text color="red.500">*</Text>
                                  </HStack>
                                </FormLabel>
                                <NumberInput
                                  value={field.value}
                                  onChange={(valueString) => setFieldValue('productQuantity', Number(valueString))}
                                  min={1}
                                  isDisabled={isLoading}
                                >
                                  <NumberInputField
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    placeholder="1"
                                  />
                                  <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                  </NumberInputStepper>
                                </NumberInput>
                                <FormErrorMessage>{errors.productQuantity}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>

                        <Stack spacing="1rem" w="100%" direction={{ base: 'column', md: 'row' }}>
                          <Field name="expirationDate" validate={validateEmpty}>
                            {({ field }: any) => (
                              <FormControl
                                isInvalid={submitCount > 0 && touched.expirationDate && !!errors.expirationDate}
                                flex="1"
                              >
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiCalendar} boxSize="1rem" />
                                    <Text>Fecha de vencimiento</Text>
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
                                <FormErrorMessage>{errors.expirationDate}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>
                        </Stack>

                        {/* Selector de tipo de productos */}
                        <FormControl>
                          <FormLabel fontWeight="semibold">Productos aplicables</FormLabel>
                          <Select
                            value={productType}
                            onChange={(e) => setProductType(e.target.value as 'all' | 'brand' | 'subcategory' | 'list')}
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading}
                          >
                            <option value="all">Todos los productos</option>
                            <option value="brand">Por marca</option>
                            <option value="subcategory">Por subcategoría</option>
                            <option value="list">Lista personalizada</option>
                          </Select>
                        </FormControl>

                        {/* Selector de marca */}
                        {productType === 'brand' && (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
                                <Text>Seleccionar marca</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              value={selectedBrandId}
                              onChange={(e) => setSelectedBrandId(e.target.value)}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              placeholder="Seleccionar marca"
                            >
                              {brands.map((brand) => (
                                <option key={brand.id} value={brand.id.toString()}>
                                  {brand.name}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {/* Selector de categoría y subcategoría */}
                        {productType === 'subcategory' && (
                          <VStack spacing="1rem" align="stretch">
                            <FormControl>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiGrid} boxSize="1rem" />
                                  <Text>Seleccionar categoría</Text>
                                </HStack>
                              </FormLabel>
                              <Select
                                value={selectedCategoryId}
                                onChange={(e) => {
                                  setSelectedCategoryId(e.target.value);
                                  setSelectedSubCategoryId(''); // Reset subcategory cuando cambia category
                                }}
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                                placeholder="Seleccionar categoría"
                              >
                                {categories.map((category) => (
                                  <option key={category.id} value={category.id.toString()}>
                                    {category.name}
                                  </option>
                                ))}
                              </Select>
                            </FormControl>

                            {selectedCategoryId && (
                              <FormControl>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiGrid} boxSize="1rem" />
                                    <Text>Seleccionar subcategoría</Text>
                                  </HStack>
                                </FormLabel>
                                <Select
                                  value={selectedSubCategoryId}
                                  onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                  placeholder="Seleccionar subcategoría"
                                >
                                  {filteredSubCategories.map((subCategory) => (
                                    <option key={subCategory.id} value={subCategory.id.toString()}>
                                      {subCategory.name}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            )}
                          </VStack>
                        )}

                        {/* Buscador de productos para lista personalizada */}
                        {productType === 'list' && (
                          <FormControl>
                            <FormLabel fontWeight="semibold">Lista de productos</FormLabel>

                            {/* Buscador de productos */}
                            <Box position="relative" ref={searchRef}>
                              <Flex
                                bg={inputBg}
                                borderRadius="md"
                                overflow="hidden"
                                borderWidth="1px"
                                borderColor={inputBorder}
                              >
                                <Select
                                  value={productSearchType}
                                  onChange={(e) =>
                                    setProductSearchType(e.target.value as 'name' | 'internalCode' | 'barcode')
                                  }
                                  bg="transparent"
                                  border="none"
                                  color={textColor}
                                  w="auto"
                                  minW={{ base: '5rem', md: '7rem' }}
                                  maxW={{ base: '6rem', md: '8rem' }}
                                  borderRadius="none"
                                  _focus={{ boxShadow: 'none' }}
                                  disabled={isLoading}
                                >
                                  <option value="name">Nombre</option>
                                  <option value="internalCode">Cód. interno</option>
                                  <option value="barcode">Cód. de barras</option>
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
                                    disabled={isLoading}
                                    onFocus={() => productSearch && setShowProductDropdown(true)}
                                  />
                                  <InputRightElement>
                                    <IconButton
                                      aria-label="Buscar"
                                      icon={<AiOutlineSearch size="1.25rem" />}
                                      size="sm"
                                      variant="ghost"
                                      disabled={isLoading}
                                      color={textColor}
                                      _hover={{}}
                                      onClick={handleClearProductSearch}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </Flex>

                              {/* Dropdown de resultados */}
                              {showProductDropdown && (
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
                                    // Estados del dropdown:
                                    // 1. Usuario está escribiendo (debounce en progreso)
                                    const isTyping =
                                      productSearch !== debouncedProductSearch && productSearch.length >= 2;
                                    // 2. Esperando resultados de la API
                                    const isSearching =
                                      !isTyping && isLoadingProducts && debouncedProductSearch.length >= 2;
                                    // 3. Mostrar resultados o mensaje de no encontrado (solo si la búsqueda está completa)
                                    const searchCompleted =
                                      !isTyping &&
                                      !isSearching &&
                                      debouncedProductSearch.length >= 2 &&
                                      lastProductSearchTerm === debouncedProductSearch;

                                    if (isTyping || isSearching) {
                                      return (
                                        <Flex p={3} justify="center" align="center" gap={2}>
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color="gray.500">
                                            Buscando productos...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    if (searchCompleted && products?.length > 0) {
                                      return (
                                        <List spacing={0}>
                                          {products.map((product: any, index: number) => {
                                            const isSelected = selectedProducts.some((p) => p.id === product.id);
                                            return (
                                              <Fragment key={product.id}>
                                                <ListItem
                                                  p="0.75rem"
                                                  cursor="pointer"
                                                  _hover={{ bg: hoverBg }}
                                                  transition="background-color 0.2s ease"
                                                  opacity={isSelected ? 0.5 : 1}
                                                  onClick={() => !isSelected && handleProductSelect(product)}
                                                >
                                                  <Flex align="center" gap="0.75rem">
                                                    <Image
                                                      src={
                                                        product.imageUrl ||
                                                        'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                                      }
                                                      alt={product.name}
                                                      boxSize="40px"
                                                      objectFit="cover"
                                                      borderRadius="md"
                                                      flexShrink={0}
                                                    />
                                                    <Box flex="1">
                                                      <Text fontSize="sm" fontWeight="medium">
                                                        {product.name}
                                                      </Text>
                                                      {product.internalCode && (
                                                        <Text fontSize="xs" color={textColor}>
                                                          Código: {product.internalCode}
                                                        </Text>
                                                      )}
                                                    </Box>
                                                    {isSelected && (
                                                      <Text fontSize="xs" color="green.500">
                                                        Seleccionado
                                                      </Text>
                                                    )}
                                                  </Flex>
                                                </ListItem>
                                                {index < products.length - 1 && <Divider />}
                                              </Fragment>
                                            );
                                          })}
                                        </List>
                                      );
                                    }

                                    if (searchCompleted && products?.length === 0) {
                                      return (
                                        <Text p={3} fontSize="sm" color="gray.500">
                                          No se encontraron productos
                                        </Text>
                                      );
                                    }

                                    // Mientras esperamos que se complete la búsqueda, mostrar loading
                                    if (debouncedProductSearch.length >= 2 && (!searchCompleted || isLoadingProducts)) {
                                      return (
                                        <Flex p={3} justify="center" align="center" gap={2}>
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color="gray.500">
                                            Buscando productos...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    return null;
                                  })()}
                                </Box>
                              )}
                            </Box>

                            {/* Lista de productos seleccionados */}
                            {selectedProducts.length > 0 && (
                              <Box mt="1rem">
                                <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                                  Productos seleccionados ({selectedProducts.length}):
                                </Text>
                                <Box
                                  maxH="150px"
                                  overflowY="auto"
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  borderRadius="md"
                                  p="0.5rem"
                                >
                                  <Stack spacing="0.5rem">
                                    {selectedProducts.map((product) => (
                                      <Flex
                                        key={product.id}
                                        align="center"
                                        justify="space-between"
                                        p="0.5rem"
                                        bg={buttonBg}
                                        borderRadius="md"
                                      >
                                        <Flex align="center" gap="0.5rem">
                                          <Image
                                            src={
                                              product.imageUrl ||
                                              'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                                            }
                                            alt={product.name}
                                            boxSize="30px"
                                            objectFit="cover"
                                            borderRadius="sm"
                                            flexShrink={0}
                                          />
                                          <Text fontSize="sm">{product.name}</Text>
                                        </Flex>
                                        <IconButton
                                          aria-label="Remover producto"
                                          icon={<FaTimes />}
                                          size="xs"
                                          variant="ghost"
                                          color="red.500"
                                          onClick={() => handleRemoveProduct(product.id)}
                                        />
                                      </Flex>
                                    ))}
                                  </Stack>
                                </Box>
                              </Box>
                            )}
                          </FormControl>
                        )}

                        {/* Selector de tipo de clientes */}
                        <FormControl>
                          <FormLabel fontWeight="semibold">Clientes aplicables</FormLabel>
                          <Select
                            value={clientType}
                            onChange={(e) => setClientType(e.target.value as 'all' | 'zone' | 'list')}
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading}
                          >
                            <option value="all">Todos los clientes</option>
                            <option value="zone">Por zona</option>
                            <option value="list">Lista personalizada</option>
                          </Select>
                        </FormControl>

                        {/* Selector de zona */}
                        {clientType === 'zone' && (
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiMapPin} boxSize="1rem" />
                                <Text>Seleccionar zona</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              value={selectedZoneId}
                              onChange={(e) => setSelectedZoneId(e.target.value)}
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              placeholder="Seleccionar zona"
                            >
                              {zones.map((zone) => (
                                <option key={zone.id} value={zone.id.toString()}>
                                  {zone.name}
                                </option>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {/* Buscador de clientes para lista personalizada */}
                        {clientType === 'list' && (
                          <FormControl>
                            <FormLabel fontWeight="semibold">Lista de clientes</FormLabel>

                            {/* Buscador de clientes */}
                            <Box position="relative" ref={clientSearchRef}>
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
                                  w="auto"
                                  minW="7rem"
                                  maxW="8rem"
                                  borderRadius="none"
                                  _focus={{ boxShadow: 'none' }}
                                  disabled={isLoading}
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
                                    disabled={isLoading}
                                    onFocus={() => clientSearch && setShowClientDropdown(true)}
                                  />
                                  <InputRightElement>
                                    <IconButton
                                      aria-label="Buscar"
                                      icon={<AiOutlineSearch size="1.25rem" />}
                                      size="sm"
                                      variant="ghost"
                                      disabled={isLoading}
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

                                    if (
                                      debouncedClientSearch.length >= 2 &&
                                      (!searchCompleted || isLoadingClientsSearch)
                                    ) {
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
                                  p="0.5rem"
                                >
                                  <Stack spacing="0.5rem">
                                    {selectedClients.map((client) => (
                                      <Flex
                                        key={client.id}
                                        align="center"
                                        justify="space-between"
                                        p="0.5rem"
                                        bg={buttonBg}
                                        borderRadius="md"
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
                                        <IconButton
                                          aria-label="Remover cliente"
                                          icon={<FaTimes />}
                                          size="xs"
                                          variant="ghost"
                                          color="red.500"
                                          onClick={() => handleRemoveClient(client.id)}
                                        />
                                      </Flex>
                                    ))}
                                  </Stack>
                                </Box>
                              </Box>
                            )}
                          </FormControl>
                        )}

                        {/* Descripción */}
                        <Field name="description" validate={validateEmpty}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiFileText} boxSize="1rem" />
                                  <Text>Descripción</Text>
                                  <Text color="red.500">*</Text>
                                </HStack>
                              </FormLabel>
                              <Textarea
                                {...field}
                                placeholder="Ingrese la descripción del descuento"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.description}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </VStack>
                    </Box>
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
                form="discount-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear descuento
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

// Componente principal que controla cuándo renderizar el formulario
export const DiscountAdd = ({ isLoading: isLoadingDiscounts, setDiscounts }: DiscountAddProps) => {
  const canCreateDiscounts = useUserStore((s) => s.hasPermission(Permission.CREATE_PRODUCTS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {canCreateDiscounts && (
        <Button
          bg={useColorModeValue('#f2f2f2', 'gray.700')}
          _hover={{ bg: useColorModeValue('#e0dede', 'gray.500') }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          px="1.5rem"
          disabled={isLoadingDiscounts}
        >
          Nuevo
        </Button>
      )}

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <DiscountAddModal isOpen={isOpen} onClose={onClose} setDiscounts={setDiscounts} />}
    </>
  );
};
