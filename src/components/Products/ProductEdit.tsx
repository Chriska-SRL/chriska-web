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
  Select,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  HStack,
  Text,
  Icon,
  SimpleGrid,
  Flex,
  InputGroup,
  InputRightElement,
  IconButton,
  List,
  ListItem,
  Spinner,
  Divider,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { useEffect, useState, useCallback, useMemo, useRef, Fragment } from 'react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  FiPackage,
  FiHash,
  FiTag,
  FiDollarSign,
  FiFileText,
  FiThermometer,
  FiGrid,
  FiBox,
  FiTruck,
} from 'react-icons/fi';
import { Product } from '@/entities/product';
import { useUpdateProduct } from '@/hooks/product';
import { validate } from '@/utils/validations/validate';
import { useGetCategories } from '@/hooks/category';
import { useGetBrands } from '@/hooks/brand';
import { useGetSuppliers } from '@/hooks/supplier';
import { ProductImageUpload } from './ProductImageUpload';
import { useGetWarehousesSimple } from '@/hooks/warehouse';
import { useGetShelves } from '@/hooks/shelve';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { UnitType } from '@/enums/unitType.enum';

type ProductEditProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

interface ProductEditFormValues {
  id: number;
  internalCode: string;
  barcode: string;
  name: string;
  price: number;
  unitType: string;
  estimatedWeight: number;
  description: string;
  temperatureCondition: string;
  observations: string;
  subCategoryId: number;
  brandId: number;
  supplierIds: number[];
  shelveId: number;
}

export const ProductEdit = ({ isOpen, onClose, product, setProducts }: ProductEditProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(product?.imageUrl || null);
  const { data: categories, isLoading: isLoadingCats } = useGetCategories();
  const { data: brands } = useGetBrands();

  // Estados para la búsqueda de proveedores
  const [supplierSearch, setSupplierSearch] = useState('');
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<
    Array<{ id: number; name: string; contactName: string; phone: string }>
  >([]);
  const [debouncedSupplierSearch, setDebouncedSupplierSearch] = useState(supplierSearch);
  const [lastSupplierSearchTerm, setLastSupplierSearchTerm] = useState('');
  const supplierSearchRef = useRef<HTMLDivElement>(null);
  const { data: warehouses = [], isLoading: isLoadingWarehouses } = useGetWarehousesSimple();
  const { data, isLoading, error, fieldError, mutate } = useUpdateProduct();

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    product?.subCategory?.category?.id ?? null,
  );
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(product?.shelve?.warehouse?.id ?? null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  const shelveFilters = useMemo(() => {
    return selectedWarehouseId ? { warehouseId: selectedWarehouseId } : undefined;
  }, [selectedWarehouseId]);

  const { data: shelves = [] } = useGetShelves(1, 100, shelveFilters);

  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);
  const filteredSubCategories = selectedCategory?.subCategories ?? [];

  // Inicializar proveedores seleccionados con los proveedores del producto
  useEffect(() => {
    if (product?.suppliers && selectedSuppliers.length === 0) {
      setSelectedSuppliers(
        product.suppliers.map((supplier) => ({
          id: supplier.id,
          name: supplier.name,
          contactName: supplier.contactName || '',
          phone: supplier.phone || '',
        })),
      );
    }
  }, [product?.suppliers, selectedSuppliers.length]);

  useEffect(() => {
    if (product?.subCategory?.category?.id) {
      setSelectedCategoryId(product.subCategory.category.id);
    }
    if (product?.shelve?.warehouse?.id) {
      setSelectedWarehouseId(product.shelve.warehouse.id);
    }
  }, [product]);

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

  useEffect(() => {
    if (data) {
      toast({
        title: 'Producto modificado',
        description: 'El producto ha sido modificado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setProducts((prevProducts) =>
        prevProducts.map((p) => (p.id === data.id ? { ...p, ...data, imageUrl: currentImageUrl || '' } : p)),
      );
      handleClose();
    }
  }, [data, currentImageUrl, setProducts, onClose, toast]);

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
      setCurrentImageUrl(newImageUrl);

      if (product) {
        // Add timestamp to force refresh in the product list as well
        const timestampedUrl = newImageUrl ? `${newImageUrl}?t=${Date.now()}` : '';

        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === product.id ? { ...p, imageUrl: timestampedUrl } : p)),
        );
      }
    },
    [product, setProducts],
  );

  const handleClose = () => {
    setCurrentImageUrl(product?.imageUrl || null);
    setSelectedCategoryId(product?.subCategory?.category?.id ?? null);
    setSelectedWarehouseId(product?.shelve?.warehouse?.id ?? null);
    setShowConfirmDialog(false);
    setSelectedSuppliers(
      product?.suppliers?.map((supplier) => ({
        id: supplier.id,
        name: supplier.name,
        contactName: supplier.contactName || '',
        phone: supplier.phone || '',
      })) || [],
    );
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

  const handleSubmit = async (values: {
    id: number;
    internalCode: string;
    barcode: string;
    name: string;
    price: number;
    unitType: string;
    estimatedWeight: number;
    description: string;
    temperatureCondition: string;
    observations: string;
    subCategoryId: number;
    brandId: number;
    supplierIds: number[];
    shelveId: number;
  }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { supplierIds, ...productData } = values;
    await mutate({
      ...productData,
      supplierIds: selectedSuppliers.map((s) => s.id),
    } as any);
  };

  if (!product) return null;

  const finalImageUrl = currentImageUrl || product.imageUrl;

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
            Editar producto
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik<ProductEditFormValues>
              initialValues={{
                id: product?.id ?? 0,
                internalCode: product?.internalCode ?? '',
                barcode: product?.barcode ?? '',
                name: product?.name ?? '',
                price: product?.price ?? 0,
                unitType: product?.unitType ?? '',
                estimatedWeight: product?.estimatedWeight ?? 0,
                description: product?.description ?? '',
                temperatureCondition: product?.temperatureCondition ?? '',
                observations: product?.observations ?? '',
                subCategoryId: product?.subCategory.id ?? 0,
                brandId: product?.brand.id ?? 0,
                supplierIds: product?.suppliers?.map((s) => s.id) ?? [],
                shelveId: product?.shelve?.id ?? 0,
              }}
              onSubmit={handleSubmit}
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
              {({ handleSubmit, errors, touched, submitCount, setFieldValue, dirty, resetForm, values }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="product-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Flex direction={{ base: 'column', md: 'row' }} gap="1rem" align="start">
                        <Box flexShrink={0} w={{ base: '100%', md: '10.5rem' }}>
                          <Box w="100%" aspectRatio="1" borderRadius="md">
                            <ProductImageUpload
                              product={{
                                ...product,
                                imageUrl: finalImageUrl,
                              }}
                              onImageChange={handleImageChange}
                              editable
                            />
                          </Box>
                        </Box>

                        <VStack spacing="1.5rem" align="stretch" flex="1" justify="start">
                          <FormControl isInvalid={submitCount > 0 && touched.internalCode && !!errors.internalCode}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiPackage} boxSize="1rem" color={iconColor} />
                                <Text>Código interno</Text>
                              </HStack>
                            </FormLabel>
                            <Field
                              as={Input}
                              name="internalCode"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled
                            />
                            <FormErrorMessage>{errors.internalCode}</FormErrorMessage>
                          </FormControl>

                          <FormControl isInvalid={submitCount > 0 && touched.barcode && !!errors.barcode}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiHash} boxSize="1rem" color={iconColor} />
                                <Text>Código de barras</Text>
                              </HStack>
                            </FormLabel>
                            <Field
                              as={Input}
                              name="barcode"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              validate={(value: any) => {
                                // Campo opcional - solo validar si se proporciona
                                if (!value) return undefined;
                                const barcodeRegex = /^\d{13}$/;
                                return barcodeRegex.test(value)
                                  ? undefined
                                  : 'Debe tener exactamente 13 dígitos numéricos';
                              }}
                            />
                            <FormErrorMessage>{errors.barcode}</FormErrorMessage>
                          </FormControl>
                        </VStack>
                      </Flex>

                      <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiTag} boxSize="1rem" color={iconColor} />
                            <Text>Nombre</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="name"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          disabled={isLoading}
                          validate={validate}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="0.75rem">
                        <FormControl isInvalid={submitCount > 0 && touched.price && !!errors.price}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiDollarSign} boxSize="1rem" color={iconColor} />
                              <Text>Precio</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Input}
                            name="price"
                            type="number"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading}
                            validate={(value: any) => {
                              const emptyError = validate(value);
                              if (emptyError) return emptyError;
                              if (!/^\d+$/.test(value)) return 'Debe ser un número válido';
                              if (value.length > 21) return 'Máximo 21 dígitos permitidos';
                              return Number(value) > 0 ? undefined : 'El precio debe ser mayor a 0';
                            }}
                          />
                          <FormErrorMessage>{errors.price}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={submitCount > 0 && touched.unitType && !!errors.unitType}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiGrid} boxSize="1rem" color={iconColor} />
                              <Text>Unidad</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Select}
                            name="unitType"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            placeholder="Seleccione una opción"
                            disabled={isLoading}
                            validate={validate}
                          >
                            <option value="Kilo">Kilos</option>
                            <option value="Unit">Unidades</option>
                          </Field>
                          <FormErrorMessage>{errors.unitType}</FormErrorMessage>
                        </FormControl>

                        <Field name="estimatedWeight">
                          {({ field }: any) => (
                            <FormControl
                              isInvalid={submitCount > 0 && touched.estimatedWeight && !!errors.estimatedWeight}
                            >
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                                  <Text>Peso estimado</Text>
                                  {values.unitType === UnitType.KILO && <Text color="red.500">*</Text>}
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
                        <FormControl isInvalid={submitCount > 0 && touched.brandId && !!errors.brandId}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiTag} boxSize="1rem" color={iconColor} />
                              <Text>Marca</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Select}
                            name="brandId"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            placeholder="Seleccione una marca"
                            disabled={isLoading}
                            validate={validate}
                          >
                            {brands?.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </Field>
                          <FormErrorMessage>{errors.brandId}</FormErrorMessage>
                        </FormControl>

                        <FormControl
                          isInvalid={submitCount > 0 && touched.temperatureCondition && !!errors.temperatureCondition}
                        >
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiThermometer} boxSize="1rem" color={iconColor} />
                              <Text>Cond. de temperatura</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Select}
                            name="temperatureCondition"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            placeholder="Seleccione una opción"
                            disabled={isLoading}
                            validate={validate}
                          >
                            <option value="Cold">Frío</option>
                            <option value="Frozen">Congelado</option>
                            <option value="Ambient">Natural</option>
                          </Field>
                          <FormErrorMessage>{errors.temperatureCondition}</FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>

                      <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" color={iconColor} />
                            <Text>Descripción</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="description"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          disabled={isLoading}
                          validate={validate}
                          rows={2}
                        />
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                        <FormControl>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiGrid} boxSize="1rem" color={iconColor} />
                              <Text>Categoría</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Select
                            placeholder="Seleccionar categoría"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            value={selectedCategoryId ?? ''}
                            disabled={isLoading || isLoadingCats}
                            onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                          >
                            {categories?.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl isInvalid={submitCount > 0 && touched.subCategoryId && !!errors.subCategoryId}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiGrid} boxSize="1rem" color={iconColor} />
                              <Text>Subcategoría</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Select}
                            name="subCategoryId"
                            placeholder="Seleccionar subcategoría"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading || isLoadingCats || !selectedCategoryId}
                            validate={validate}
                          >
                            {filteredSubCategories.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                {sub.name}
                              </option>
                            ))}
                          </Field>
                          <FormErrorMessage>{errors.subCategoryId}</FormErrorMessage>
                        </FormControl>
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                        <FormControl isInvalid={submitCount > 0 && touched.shelveId && !!errors.shelveId}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                              <Text>Depósito</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Select
                            placeholder="Seleccionar depósito"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading || isLoadingWarehouses}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                              const selectedId = Number(e.target.value);
                              setFieldValue('shelveId', '');
                              setSelectedWarehouseId(selectedId || null);
                            }}
                            value={selectedWarehouseId || ''}
                          >
                            {warehouses.map((warehouse) => (
                              <option key={warehouse.id} value={warehouse.id}>
                                {warehouse.name}
                              </option>
                            ))}
                          </Select>
                          <FormErrorMessage>{errors.shelveId}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={submitCount > 0 && touched.shelveId && !!errors.shelveId}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                              <Text>Estantería</Text>
                              <Text color="red.500">*</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Select}
                            name="shelveId"
                            placeholder="Seleccionar estantería"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading || !selectedWarehouseId}
                            validate={validate}
                          >
                            {shelves.map((shelve) => (
                              <option key={shelve.id} value={shelve.id}>
                                {shelve.name}
                              </option>
                            ))}
                          </Field>
                          <FormErrorMessage>{errors.shelveId}</FormErrorMessage>
                        </FormControl>
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

                      <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" color={iconColor} />
                            <Text>Observaciones</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="observations"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          disabled={isLoading}
                          rows={2}
                        />
                        <FormErrorMessage>{errors.observations}</FormErrorMessage>
                      </FormControl>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm" leftIcon={<FaTimes />}>
                Cancelar
              </Button>
              <Button
                form="product-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Guardando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Guardar cambios
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
