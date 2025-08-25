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
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
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
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { FiPercent, FiCalendar, FiPackage, FiMapPin, FiTag, FiFileText, FiCheckCircle, FiGrid } from 'react-icons/fi';
import { Field, Formik } from 'formik';
import { useEffect, useState, useMemo, useRef, Fragment, useCallback } from 'react';
import { Discount } from '@/entities/discount';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { useUpdateDiscount } from '@/hooks/discount';
import { useGetProducts } from '@/hooks/product';
import { useGetClients } from '@/hooks/client';
import { useGetBrands } from '@/hooks/brand';
import { useGetZones } from '@/hooks/zone';
import { DiscountStatusOptions } from '@/enums/discountStatus.enum';
import { format } from 'date-fns';
import { useGetCategories } from '@/hooks/category';
import { useGetSubCategories } from '@/hooks/subcategory';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type DiscountEditProps = {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount | null;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const DiscountEditForm = ({
  isOpen,
  onClose,
  discount,
  setDiscounts,
}: {
  isOpen: boolean;
  onClose: () => void;
  discount: Discount;
  setDiscounts: React.Dispatch<React.SetStateAction<Discount[]>>;
}) => {
  const toast = useToast();

  const [updateProps, setUpdateProps] = useState<{
    id: string;
    discount: {
      description: string;
      expirationDate: string;
      productQuantity: number;
      percentage: number;
      status: string;
      discountProductId: number[];
      discountClientId: number[];
      brandId?: string;
      subCategoryId?: string;
      zoneId?: string;
    };
  }>();
  const { data, isLoading, error, fieldError } = useUpdateDiscount(updateProps);

  // Load data using hooks - they handle caching internally
  const { data: brands = [] } = useGetBrands();
  const { data: categories = [] } = useGetCategories();
  const { data: subCategories = [] } = useGetSubCategories();
  const { data: zones = [] } = useGetZones();

  // Estados para productos
  const [productType, setProductType] = useState<'all' | 'brand' | 'subcategory' | 'list'>('list');
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
  const [clientType, setClientType] = useState<'all' | 'zone' | 'list'>('list');
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

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

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

  // Solo buscar cuando realmente hay búsqueda activa
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

  // Initialize selected items when discount data is available
  useEffect(() => {
    if (discount && selectedProducts.length === 0 && discount.products) {
      setSelectedProducts(discount.products.map((p) => ({ id: p.id, name: p.name, imageUrl: p.imageUrl })));
    }
    if (discount && selectedClients.length === 0 && discount.clients) {
      setSelectedClients(
        discount.clients.map((c) => ({ id: c.id, name: c.name, rut: c.rut, contactName: c.contactName })),
      );
    }

    // Set initial types based on discount data
    if (discount && discount.brand) {
      setProductType('brand');
      setSelectedBrandId(discount.brand.id.toString());
    } else if (discount && discount.subCategory) {
      setProductType('subcategory');
      setSelectedSubCategoryId(discount.subCategory.id.toString());
      setSelectedCategoryId(discount.subCategory.category.id.toString());
    } else if (discount && discount.products && discount.products.length > 0) {
      setProductType('list');
    } else {
      setProductType('all');
    }

    if (discount && discount.zone) {
      setClientType('zone');
      setSelectedZoneId(discount.zone.id.toString());
    } else if (discount && discount.clients && discount.clients.length > 0) {
      setClientType('list');
    } else {
      setClientType('all');
    }
  }, [discount, selectedProducts.length, selectedClients.length]);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const dividerColor = useColorModeValue('gray.300', 'gray.600');

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
    setProductType('list');
    setSelectedBrandId('');
    setSelectedCategoryId('');
    setSelectedSubCategoryId('');
    setSelectedZoneId('');
    setClientType('list');
    setSelectedProducts([]);
    setSelectedClients([]);
    setProductSearch('');
    setClientSearch('');
    setShowProductDropdown(false);
    setShowClientDropdown(false);
    setUpdateProps(undefined);
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

  // Success useEffect following ProductEdit pattern
  useEffect(() => {
    if (data) {
      toast({
        title: 'Descuento actualizado',
        description: 'El descuento ha sido actualizado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setUpdateProps(undefined);
      setDiscounts((prev) => prev.map((d) => (d.id === data.id ? data : d)));
      handleClose();
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
    (values: {
      description: string;
      expirationDate: string;
      productQuantity: number;
      percentage: number;
      status: string;
    }) => {
      // Prevent double submission
      if (isLoading || updateProps) return;

      // Create the update object with only necessary fields
      const discountUpdate: any = {
        description: values.description,
        expirationDate: values.expirationDate,
        productQuantity: values.productQuantity,
        percentage: values.percentage,
        status: values.status,
      };

      // Add product-related fields only when necessary
      if (productType === 'brand' && selectedBrandId) {
        discountUpdate.brandId = selectedBrandId;
      } else if (productType === 'subcategory' && selectedSubCategoryId) {
        discountUpdate.subCategoryId = selectedSubCategoryId;
      } else if (productType === 'list') {
        discountUpdate.discountProductId = selectedProducts.map((p) => p.id);
      }
      // If productType === 'all', don't send any product-related fields

      // Add client-related fields only when necessary
      if (clientType === 'zone' && selectedZoneId) {
        discountUpdate.zoneId = selectedZoneId;
      } else if (clientType === 'list') {
        discountUpdate.discountClientId = selectedClients.map((c) => c.id);
      }
      // If clientType === 'all', don't send any client-related fields

      const updateData = {
        id: discount.id,
        discount: discountUpdate,
      };

      setUpdateProps(updateData);
    },
    [
      isLoading,
      updateProps,
      productType,
      selectedProducts,
      clientType,
      selectedClients,
      selectedBrandId,
      selectedSubCategoryId,
      selectedZoneId,
      discount.id,
    ],
  );

  const statusOptions = DiscountStatusOptions;

  const formatDateForInput = (date: string) => {
    try {
      return format(new Date(date), 'yyyy-MM-dd');
    } catch {
      return date;
    }
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
            Editar descuento
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                description: discount.description,
                expirationDate: formatDateForInput(discount.expirationDate),
                productQuantity: discount.productQuantity,
                percentage: discount.percentage,
                status: discount.status,
              }}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="discount-edit-form" onSubmit={handleSubmit}>
                    <Box>
                      <VStack spacing="1rem" align="stretch">
                        <Field name="description" validate={validateEmpty}>
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiFileText} boxSize="1rem" />
                                  <Text>Descripción</Text>
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

                        <Stack spacing="1rem" w="100%" direction={{ base: 'column', md: 'row' }}>
                          <Field name="percentage" validate={validateEmpty}>
                            {({ field, meta }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.percentage && !!errors.percentage} flex="1">
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiPercent} boxSize="1rem" />
                                    <Text>Porcentaje (%)</Text>
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
                            {({ field, meta }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.productQuantity && !!errors.productQuantity} flex="1">
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiPackage} boxSize="1rem" />
                                    <Text>Cantidad mínima</Text>
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
                            {({ field, meta }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.expirationDate && !!errors.expirationDate} flex="1">
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiCalendar} boxSize="1rem" />
                                    <Text>Fecha de vencimiento</Text>
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

                          <Field name="status" validate={validateEmpty}>
                            {({ field, meta }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.status && !!errors.status} flex="1">
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiCheckCircle} boxSize="1rem" />
                                    <Text>Estado</Text>
                                  </HStack>
                                </FormLabel>
                                <Select
                                  {...field}
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                >
                                  {statusOptions.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </Select>
                                <FormErrorMessage>{errors.status}</FormErrorMessage>
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
                                    // Estados del dropdown:
                                    // 1. Usuario está escribiendo (debounce en progreso)
                                    const isTyping = clientSearch !== debouncedClientSearch && clientSearch.length >= 2;
                                    // 2. Esperando resultados de la API
                                    const isSearching =
                                      !isTyping && isLoadingClientsSearch && debouncedClientSearch.length >= 2;
                                    // 3. Mostrar resultados o mensaje de no encontrado (solo si la búsqueda está completa)
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

                                    // Mientras esperamos que se complete la búsqueda, mostrar loading
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
                form="discount-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Actualizando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Actualizar descuento
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
export const DiscountEdit = ({ isOpen, onClose, discount, setDiscounts }: DiscountEditProps) => {
  // Solo renderizar el formulario cuando el modal está abierto y hay discount
  if (!isOpen || !discount) return null;

  return <DiscountEditForm isOpen={isOpen} onClose={onClose} discount={discount} setDiscounts={setDiscounts} />;
};
