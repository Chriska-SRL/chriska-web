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
  Textarea,
  Select,
  useToast,
  VStack,
  Box,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  IconButton,
  List,
  ListItem,
  Spinner,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { FiTag, FiHash, FiFileText, FiGrid, FiThermometer, FiTruck, FiDollarSign, FiBox } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { useEffect, useState, useCallback, useMemo, useRef, Fragment } from 'react';
import { validate } from '@/utils/validations/validate';
import { useAddProduct } from '@/hooks/product';
import { useGetCategories } from '@/hooks/category';
import { Product } from '@/entities/product';
import { useGetBrands } from '@/hooks/brand';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { ProductImageUpload } from './ProductImageUpload';
import { useGetSuppliers } from '@/hooks/supplier';
import { useGetWarehousesSimple } from '@/hooks/warehouse';
import { useGetShelves } from '@/hooks/shelve';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ProductAddProps = {
  isLoading: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

type ProductAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const ProductAddModal = ({ isOpen, onClose, setProducts }: ProductAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.600', 'green.200');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const [step, setStep] = useState<'form' | 'image'>('form');
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const { data, isLoading, error, fieldError, mutate } = useAddProduct();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  // Estados para la búsqueda de proveedores
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<
    Array<{ id: number; name: string; contactName: string; phone: string }>
  >([]);
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState(supplierSearch);
  const [lastSupplierSearchTerm, setLastSupplierSearchTerm] = useState('');
  const supplierSearchRef = useRef<HTMLDivElement>(null);

  const { data: categories = [], isLoading: isLoadingCats } = useGetCategories();
  const { data: brands = [] } = useGetBrands();
  // Debounce para búsqueda de proveedores
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSupplierSearch(supplierSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [supplierSearch]);

  // Filtro de búsqueda de proveedores
  const supplierFilterName = useMemo(() => {
    return debouncedSupplierSearch && debouncedSupplierSearch.length >= 2 ? debouncedSupplierSearch : undefined;
  }, [debouncedSupplierSearch]);

  const { data: suppliersSearch = [], isLoading: isLoadingSuppliersSearch } = useGetSuppliers(
    1,
    10,
    supplierFilterName,
  );
  const { data: warehouses = [], isLoading: isLoadingWarehouses } = useGetWarehousesSimple();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('');
  const selectedCategory = categories.find((cat) => cat.id === Number(selectedCategoryId));
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>('');

  const shelveFilters = useMemo(() => {
    return selectedWarehouseId && selectedWarehouseId !== '' ? { warehouseId: Number(selectedWarehouseId) } : undefined;
  }, [selectedWarehouseId]);

  const { data: shelves = [] } = useGetShelves(1, 100, shelveFilters);

  // Actualizar el término de búsqueda cuando se completa la búsqueda
  useEffect(() => {
    if (!isLoadingSuppliersSearch && debouncedSupplierSearch && debouncedSupplierSearch.length >= 2) {
      setLastSupplierSearchTerm(debouncedSupplierSearch);
    }
  }, [isLoadingSuppliersSearch, debouncedSupplierSearch]);

  // Funciones para manejar búsqueda de proveedores
  const handleSupplierSearch = (value: string) => {
    setSupplierSearch(value);
    if (value.length >= 2) {
      setShowSupplierDropdown(true);
    } else {
      setShowSupplierDropdown(false);
    }
  };

  const handleSupplierSelect = (supplier: any) => {
    const isAlreadySelected = selectedSuppliers.some((s) => s.id === supplier.id);
    if (!isAlreadySelected) {
      setSelectedSuppliers((prev) => [
        ...prev,
        {
          id: supplier.id,
          name: supplier.name,
          contactName: supplier.contactName,
          phone: supplier.phone,
        },
      ]);
    }
    setSupplierSearch('');
    setShowSupplierDropdown(false);
  };

  const handleRemoveSupplier = (supplierId: number) => {
    setSelectedSuppliers((prev) => prev.filter((s) => s.id !== supplierId));
  };

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
    setStep('form');
    setCreatedProduct(null);
    setSelectedCategoryId('');
    setSelectedWarehouseId('');
    setShowConfirmDialog(false);
    setSelectedSuppliers([]);
    setSupplierSearch('');
    setShowSupplierDropdown(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    // Only show confirmation dialog if we're in form step and have unsaved changes
    if (step === 'form' && formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (data) {
      toast({
        title: 'Producto creado',
        description: `El producto ha sido creado correctamente.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setCreatedProduct(data);
      setProducts((prev) => [...prev, data]);
      setStep('image');
    }
  }, [data, setProducts, toast]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: `Error`,
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

  const handleImageChange = useCallback(
    (newImageUrl: string | null) => {
      if (createdProduct) {
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === createdProduct.id ? { ...p, imageUrl: newImageUrl || '' } : p)),
        );
        setCreatedProduct((prev) => (prev ? { ...prev, imageUrl: newImageUrl || '' } : null));
      }
    },
    [createdProduct, setProducts],
  );

  const handleSkipImage = () => {
    toast({
      title: 'Producto creado sin imagen',
      description: 'Puedes agregar una imagen más tarde editando el producto.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    handleClose();
  };

  const handleFinishWithImage = () => {
    toast({
      title: '¡Perfecto!',
      description: 'Producto creado con imagen correctamente.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    handleClose();
  };

  const handleSubmit = async (values: {
    barcode: string;
    name: string;
    price: number;
    unitType: string;
    estimatedWeight: number;
    description: string;
    temperatureCondition: string;
    observations: string;
    subCategoryId: string;
    brandId: string;
    supplierIds: number[];
    shelveId: string;
  }) => {
    const product = {
      barcode: values.barcode,
      name: values.name,
      price: values.price,
      unitType: values.unitType,
      estimatedWeight: values.estimatedWeight,
      description: values.description,
      temperatureCondition: values.temperatureCondition,
      observations: values.observations,
      subCategoryId: Number(values.subCategoryId),
      brandId: Number(values.brandId),
      supplierIds: values.supplierIds,
      shelveId: Number(values.shelveId),
    };
    await mutate(product as any);
  };

  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (createdProduct?.imageUrl) {
      setHasImage(true);
    }
  }, [createdProduct?.imageUrl]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: step === 'form' ? 'xl' : 'sm' }}
        isCentered
        closeOnOverlayClick={step === 'image'}
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
            {step === 'form' ? 'Nuevo producto' : 'Producto creado'}
          </ModalHeader>

          {step === 'form' ? (
            <>
              <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
                <Formik
                  initialValues={{
                    barcode: '',
                    name: '',
                    price: 0,
                    unitType: '',
                    estimatedWeight: 0,
                    description: '',
                    temperatureCondition: '',
                    observations: '',
                    categoryId: '',
                    subCategoryId: '',
                    brandId: '',
                    supplierIds: [],
                    warehouseId: '',
                    shelveId: '',
                  }}
                  onSubmit={(values) => {
                    // Update supplierIds from selectedSuppliers before submitting
                    const updatedValues = {
                      ...values,
                      supplierIds: selectedSuppliers.map((s) => s.id),
                    };
                    handleSubmit(updatedValues);
                  }}
                  enableReinitialize
                  validateOnChange={true}
                  validateOnBlur={false}
                  validate={(values) => {
                    const errors: any = {};

                    // Validar peso estimado solo si unitType es Kilo
                    if (values.unitType === 'Kilo' && (!values.estimatedWeight || values.estimatedWeight <= 0)) {
                      errors.estimatedWeight = 'El peso estimado es obligatorio para productos por kilo';
                    }

                    return errors;
                  }}
                >
                  {({ handleSubmit, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                    // Actualizar la instancia de formik solo cuando cambie
                    useEffect(() => {
                      setFormikInstance({ dirty, resetForm });
                    }, [dirty, resetForm]);

                    return (
                      <form id="product-add-form" onSubmit={handleSubmit}>
                        <VStack spacing="1rem" align="stretch">
                          <Field name="barcode">
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.barcode && !!errors.barcode}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiHash} boxSize="1rem" color={iconColor} />
                                    <Text>Código de barras (opcional)</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  {...field}
                                  placeholder="Ingrese el código de barras"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                />
                                <FormErrorMessage>{errors.barcode}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Field name="name" validate={validate}>
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiTag} boxSize="1rem" color={iconColor} />
                                    <Text>Nombre</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  {...field}
                                  placeholder="Ingrese el nombre del producto"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                />
                                <FormErrorMessage>{errors.name}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <SimpleGrid columns={{ base: 1, md: 3 }} spacing="0.75rem">
                            <Field name="price" validate={validate}>
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.price && !!errors.price}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiDollarSign} boxSize="1rem" color={iconColor} />
                                      <Text>Precio</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    type="number"
                                    placeholder="Ingrese el precio"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading}
                                  />
                                  <FormErrorMessage>{errors.price}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>

                            <Field name="unitType" validate={validate}>
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.unitType && !!errors.unitType}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiGrid} boxSize="1rem" color={iconColor} />
                                      <Text>Unidad</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccione una opción"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading}
                                  >
                                    <option value="Kilo">Kilos</option>
                                    <option value="Unit">Unidades</option>
                                  </Select>
                                  <FormErrorMessage>{errors.unitType}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>

                            <Field name="estimatedWeight">
                              {({ field }: any) => (
                                <FormControl
                                  isInvalid={submitCount > 0 && touched.estimatedWeight && !!errors.estimatedWeight}
                                >
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                                      <Text>Peso estimado</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Input
                                    {...field}
                                    type="number"
                                    step="1"
                                    placeholder="Ingrese el peso estimado en gramos"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading}
                                  />
                                  <FormErrorMessage>{errors.estimatedWeight}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </SimpleGrid>

                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                            <Field name="brandId" validate={validate}>
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.brandId && !!errors.brandId}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiTag} boxSize="1rem" color={iconColor} />
                                      <Text>Marca</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccione una marca"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading}
                                  >
                                    {brands?.map((brand) => (
                                      <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{errors.brandId}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>

                            <Field name="temperatureCondition" validate={validate}>
                              {({ field }: any) => (
                                <FormControl
                                  isInvalid={
                                    submitCount > 0 && touched.temperatureCondition && !!errors.temperatureCondition
                                  }
                                >
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiThermometer} boxSize="1rem" color={iconColor} />
                                      <Text>Condición de temperatura</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccione una opción"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading}
                                  >
                                    <option value="Cold">Frío</option>
                                    <option value="Frozen">Congelado</option>
                                    <option value="Ambient">Natural</option>
                                  </Select>
                                  <FormErrorMessage>{errors.temperatureCondition}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </SimpleGrid>

                          <Field name="description" validate={validate}>
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiFileText} boxSize="1rem" color={iconColor} />
                                    <Text>Descripción</Text>
                                  </HStack>
                                </FormLabel>
                                <Textarea
                                  {...field}
                                  placeholder="Ingrese la descripción del producto"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                  rows={3}
                                />
                                <FormErrorMessage>{errors.description}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                            <Field name="categoryId" validate={validate}>
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.categoryId && !!errors.categoryId}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiGrid} boxSize="1rem" color={iconColor} />
                                      <Text>Categoría</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccionar categoría"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    value={selectedCategoryId}
                                    disabled={isLoading || isLoadingCats}
                                    onChange={(e) => {
                                      const selectedId = e.target.value;
                                      setFieldValue('categoryId', selectedId);
                                      setFieldValue('subCategoryId', '');
                                      setSelectedCategoryId(selectedId);
                                    }}
                                  >
                                    {categories.map((cat) => (
                                      <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>

                            <Field name="subCategoryId" validate={validate}>
                              {({ field }: any) => (
                                <FormControl
                                  isInvalid={submitCount > 0 && touched.subCategoryId && !!errors.subCategoryId}
                                >
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiGrid} boxSize="1rem" color={iconColor} />
                                      <Text>Subcategoría</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccionar subcategoría"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading || !selectedCategoryId}
                                  >
                                    {selectedCategory?.subCategories.map((sub: any) => (
                                      <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{errors.subCategoryId}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </SimpleGrid>

                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                            <Field name="warehouseId" validate={validate}>
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.warehouseId && !!errors.warehouseId}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                                      <Text>Depósito</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccionar depósito"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    value={selectedWarehouseId}
                                    disabled={isLoading || isLoadingWarehouses}
                                    onChange={(e) => {
                                      const selectedId = e.target.value;
                                      setFieldValue('warehouseId', selectedId);
                                      setFieldValue('shelveId', '');
                                      setSelectedWarehouseId(selectedId);
                                    }}
                                  >
                                    {warehouses.map((warehouse) => (
                                      <option key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{errors.warehouseId}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>

                            <Field name="shelveId" validate={validate}>
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.shelveId && !!errors.shelveId}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                                      <Text>Estantería</Text>
                                    </HStack>
                                  </FormLabel>
                                  <Select
                                    {...field}
                                    placeholder="Seleccionar estantería"
                                    bg={inputBg}
                                    border="1px solid"
                                    borderColor={inputBorder}
                                    disabled={isLoading || !selectedWarehouseId}
                                  >
                                    {shelves.map((shelve) => (
                                      <option key={shelve.id} value={shelve.id}>
                                        {shelve.name}
                                      </option>
                                    ))}
                                  </Select>
                                  <FormErrorMessage>{errors.shelveId}</FormErrorMessage>
                                </FormControl>
                              )}
                            </Field>
                          </SimpleGrid>

                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTruck} boxSize="1rem" color={iconColor} />
                                <Text>Proveedores</Text>
                              </HStack>
                            </FormLabel>

                            {/* Búsqueda de proveedores */}
                            <Box position="relative" ref={supplierSearchRef}>
                              <Flex
                                bg={inputBg}
                                borderRadius="md"
                                overflow="hidden"
                                borderWidth="1px"
                                borderColor={inputBorder}
                              >
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
                                    onFocus={() => supplierSearch && setShowSupplierDropdown(true)}
                                  />
                                  <InputRightElement>
                                    <IconButton
                                      aria-label="Buscar"
                                      icon={<AiOutlineSearch size="1.25rem" />}
                                      size="sm"
                                      variant="ghost"
                                      color={textColor}
                                      _hover={{}}
                                    />
                                  </InputRightElement>
                                </InputGroup>
                              </Flex>

                              {/* Dropdown de resultados de proveedores */}
                              {showSupplierDropdown && (
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
                                        <Flex p={3} justify="center" align="center" gap={2}>
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color="gray.500">
                                            Buscando proveedores...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    if (searchCompleted && suppliersSearch?.length > 0) {
                                      return (
                                        <List spacing={0}>
                                          {suppliersSearch.map((supplier: any, index: number) => {
                                            const isSelected = selectedSuppliers.some((s) => s.id === supplier.id);
                                            return (
                                              <Fragment key={supplier.id}>
                                                <ListItem
                                                  p="0.75rem"
                                                  cursor="pointer"
                                                  _hover={{ bg: hoverBg }}
                                                  transition="background-color 0.2s ease"
                                                  opacity={isSelected ? 0.5 : 1}
                                                  onClick={() => !isSelected && handleSupplierSelect(supplier)}
                                                >
                                                  <Box>
                                                    <Text fontSize="sm" fontWeight="medium">
                                                      {supplier.name}
                                                    </Text>
                                                    <Text fontSize="xs" color={textColor}>
                                                      {supplier.contactName && `Contacto: ${supplier.contactName}`}
                                                      {supplier.phone && ` - Tel: ${supplier.phone}`}
                                                    </Text>
                                                    {isSelected && (
                                                      <Text fontSize="xs" color="green.500">
                                                        Seleccionado
                                                      </Text>
                                                    )}
                                                  </Box>
                                                </ListItem>
                                                {index < suppliersSearch.length - 1 && <Divider />}
                                              </Fragment>
                                            );
                                          })}
                                        </List>
                                      );
                                    }

                                    if (searchCompleted && suppliersSearch?.length === 0) {
                                      return (
                                        <Text p={3} fontSize="sm" color="gray.500">
                                          No se encontraron proveedores
                                        </Text>
                                      );
                                    }

                                    if (
                                      debouncedSupplierSearch.length >= 2 &&
                                      (!searchCompleted || isLoadingSuppliersSearch)
                                    ) {
                                      return (
                                        <Flex p={3} justify="center" align="center" gap={2}>
                                          <Spinner size="sm" />
                                          <Text fontSize="sm" color="gray.500">
                                            Buscando proveedores...
                                          </Text>
                                        </Flex>
                                      );
                                    }

                                    return null;
                                  })()}
                                </Box>
                              )}
                            </Box>

                            {/* Lista de proveedores seleccionados */}
                            {selectedSuppliers.length > 0 && (
                              <Box mt="1rem">
                                <Text fontSize="sm" fontWeight="medium" mb="0.5rem">
                                  Proveedores seleccionados ({selectedSuppliers.length}):
                                </Text>
                                <VStack spacing="0.5rem" align="stretch">
                                  {selectedSuppliers.map((supplier) => (
                                    <Flex
                                      key={supplier.id}
                                      p="0.5rem 0.75rem"
                                      border="1px solid"
                                      borderColor={inputBorder}
                                      borderRadius="md"
                                      bg={inputBg}
                                      align="center"
                                      justify="space-between"
                                    >
                                      <Box flex="1">
                                        <Text fontSize="sm" fontWeight="medium">
                                          {supplier.name}
                                        </Text>
                                        <Text fontSize="xs" color={textColor}>
                                          {supplier.contactName && `Contacto: ${supplier.contactName}`}
                                          {supplier.phone && ` - Tel: ${supplier.phone}`}
                                        </Text>
                                      </Box>
                                      <IconButton
                                        aria-label="Eliminar proveedor"
                                        icon={<FaTrash />}
                                        size="sm"
                                        colorScheme="red"
                                        variant="ghost"
                                        onClick={() => handleRemoveSupplier(supplier.id)}
                                        flexShrink={0}
                                      />
                                    </Flex>
                                  ))}
                                </VStack>
                              </Box>
                            )}
                          </FormControl>

                          <Field name="observations">
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiFileText} boxSize="1rem" color={iconColor} />
                                    <Text>Observaciones (opcional)</Text>
                                  </HStack>
                                </FormLabel>
                                <Textarea
                                  {...field}
                                  placeholder="Ingrese observaciones adicionales"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                  rows={3}
                                />
                                <FormErrorMessage>{errors.observations}</FormErrorMessage>
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
                    form="product-add-form"
                    type="submit"
                    colorScheme="blue"
                    variant="outline"
                    isLoading={isLoading}
                    loadingText="Creando..."
                    leftIcon={<FaCheck />}
                    size="sm"
                  >
                    Crear producto
                  </Button>
                </HStack>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
                <VStack spacing="1rem">
                  <Box w="100%" p="1rem" bg={successBg} borderRadius="md" textAlign="center">
                    <HStack justifyContent="center" mb="0.5rem">
                      <Icon as={FaCheck} color={successColor} />
                      <Text color={successColor} fontWeight="medium">
                        Producto creado exitosamente
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={successColor}>
                      {hasImage ? '¡Imagen agregada!' : '¿Quieres agregar una imagen ahora?'}
                    </Text>
                  </Box>

                  {createdProduct && (
                    <Box w="100%" maxW="20rem" mx="auto">
                      <Box w="100%" aspectRatio="1" borderRadius="md">
                        <ProductImageUpload
                          product={createdProduct}
                          onImageChange={handleImageChange}
                          editable={!hasImage}
                        />
                      </Box>
                    </Box>
                  )}
                </VStack>
              </ModalBody>

              <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
                <HStack spacing="0.5rem">
                  {hasImage ? (
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<FaCheck />}
                      onClick={handleFinishWithImage}
                      size="sm"
                    >
                      Finalizar
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={handleSkipImage} size="sm">
                      Omitir imagen por ahora
                    </Button>
                  )}
                </HStack>
              </ModalFooter>
            </>
          )}
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
export const ProductAdd = ({ isLoading: isLoadingProducts, setProducts }: ProductAddProps) => {
  const canCreateProducts = useUserStore((s) => s.hasPermission(Permission.CREATE_PRODUCTS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateProducts) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingProducts}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <ProductAddModal isOpen={isOpen} onClose={onClose} setProducts={setProducts} />}
    </>
  );
};
