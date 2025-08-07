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
  Progress,
  Box,
  Select,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  HStack,
  Checkbox,
  Text,
} from '@chakra-ui/react';
import { Field, Formik, FieldArray } from 'formik';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Product } from '@/entities/product';
import { useUpdateProduct } from '@/hooks/product';
import { validate } from '@/utils/validations/validate';
import { useGetCategories } from '@/hooks/category';
import { useGetBrands } from '@/hooks/brand';
import { useGetSuppliers } from '@/hooks/supplier';
import { ProductImageUpload } from './ProductImageUpload';
import { Supplier } from '@/entities/supplier';
import { useGetWarehousesSimple } from '@/hooks/warehouse';
import { useGetShelves } from '@/hooks/shelve';

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

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#4C88D8', 'blue.500');
  const buttonHover = useColorModeValue('#376bb0', 'blue.600');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedHoverBg = useColorModeValue('blue.100', 'blue.800');
  const unselectedHoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const supplierSubtextColor = useColorModeValue('gray.600', 'gray.400');

  const [productProps, setProductProps] = useState<Partial<Product> | undefined>();
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(product?.imageUrl || null);
  const { data: categories, isLoading: isLoadingCats } = useGetCategories();
  const { data: brands } = useGetBrands();
  const { data: suppliers } = useGetSuppliers(1, 100);
  const { data: warehouses = [], isLoading: isLoadingWarehouses } = useGetWarehousesSimple();
  const { data, isLoading, error, fieldError } = useUpdateProduct(productProps);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    product?.subCategory?.category?.id ?? null,
  );
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(
    product?.shelve?.warehouse?.id ?? null,
  );
  
  const shelveFilters = useMemo(() => {
    return selectedWarehouseId ? { warehouseId: selectedWarehouseId } : undefined;
  }, [selectedWarehouseId]);
  
  const { data: shelves = [] } = useGetShelves(1, 100, shelveFilters);

  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);
  const filteredSubCategories = selectedCategory?.subCategories ?? [];

  useEffect(() => {
    if (product?.subCategory?.category?.id) {
      setSelectedCategoryId(product.subCategory.category.id);
    }
    if (product?.shelve?.warehouse?.id) {
      setSelectedWarehouseId(product.shelve.warehouse.id);
    }
  }, [product]);

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
      setProductProps(undefined);
      onClose();
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

  const handleSubmit = (values: {
    id: number;
    internalCode: string;
    barcode: string;
    name: string;
    price: number;
    unitType: string;
    description: string;
    temperatureCondition: string;
    observations: string;
    subCategoryId: number;
    brandId: number;
    supplierIds: number[];
    shelveId: number;
  }) => {
    const { supplierIds, ...productData } = values;
    setProductProps({
      ...productData,
      supplierIds: supplierIds,
    } as any);
  };

  if (!product) return null;

  const finalImageUrl = currentImageUrl || product.imageUrl;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="1.75rem">
          Editar producto
        </ModalHeader>
        <ModalCloseButton />
        <Formik<ProductEditFormValues>
          initialValues={{
            id: product?.id ?? 0,
            internalCode: product?.internalCode ?? '',
            barcode: product?.barcode ?? '',
            name: product?.name ?? '',
            price: product?.price ?? 0,
            unitType: product?.unitType ?? '',
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
        >
          {({ handleSubmit, errors, submitCount, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0" maxH="70dvh" overflowY="auto">
                <VStack spacing="0.75rem">
                  <ProductImageUpload
                    product={{
                      ...product,
                      imageUrl: finalImageUrl,
                    }}
                    onImageChange={handleImageChange}
                    editable
                  />

                  <FormControl isInvalid={submitCount > 0 && !!errors.internalCode}>
                    <FormLabel>Código interno</FormLabel>
                    <Field as={Input} name="internalCode" bg={inputBg} borderColor={inputBorder} disabled />
                    <FormErrorMessage>{errors.internalCode}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.barcode}>
                    <FormLabel>Código de barras</FormLabel>
                    <Field
                      as={Input}
                      name="barcode"
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled={isLoading}
                      validate={(value: any) => {
                        if (!value) return undefined;
                        const barcodeRegex = /^\d{13}$/;
                        return barcodeRegex.test(value) ? undefined : 'Debe tener exactamente 13 dígitos numéricos';
                      }}
                    />
                    <FormErrorMessage>{errors.barcode}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.name}>
                    <FormLabel>Nombre</FormLabel>
                    <Field
                      as={Input}
                      name="name"
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled={isLoading}
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.price}>
                    <FormLabel>Precio</FormLabel>
                    <Field
                      as={Input}
                      name="price"
                      type="number"
                      bg={inputBg}
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

                  <FormControl isInvalid={submitCount > 0 && !!errors.unitType}>
                    <FormLabel>Unidad</FormLabel>
                    <Field
                      as={Select}
                      name="unitType"
                      bg={inputBg}
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

                  <FormControl isInvalid={submitCount > 0 && !!errors.description}>
                    <FormLabel>Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      name="description"
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled={isLoading}
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.brandId}>
                    <FormLabel>Marca</FormLabel>
                    <Field
                      as={Select}
                      name="brandId"
                      bg={inputBg}
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

                  <FormControl isInvalid={submitCount > 0 && !!errors.temperatureCondition}>
                    <FormLabel>Condición de temperatura</FormLabel>
                    <Field
                      as={Select}
                      name="temperatureCondition"
                      bg={inputBg}
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

                  <FormControl isInvalid={submitCount > 0 && !!errors.observations}>
                    <FormLabel>Observaciones</FormLabel>
                    <Field
                      as={Textarea}
                      name="observations"
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.observations}</FormErrorMessage>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      placeholder="Seleccionar categoría"
                      bg={inputBg}
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

                  <FormControl isInvalid={submitCount > 0 && !!errors.subCategoryId}>
                    <FormLabel>Subcategoría</FormLabel>
                    <Field
                      as={Select}
                      name="subCategoryId"
                      placeholder="Seleccionar subcategoría"
                      bg={inputBg}
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

                  <FormControl isInvalid={submitCount > 0 && !!errors.shelveId}>
                    <FormLabel>Depósito</FormLabel>
                    <Select
                      placeholder="Seleccionar depósito"
                      bg={inputBg}
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
                    <FormErrorMessage>
                      {errors.shelveId && 'Depósito es requerido'}
                    </FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.shelveId}>
                    <FormLabel>Estantería</FormLabel>
                    <Field
                      as={Select}
                      name="shelveId"
                      placeholder="Seleccionar estantería"
                      bg={inputBg}
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

                  <FormControl>
                    <FormLabel>Proveedores</FormLabel>
                    <FieldArray name="supplierIds">
                      {({ push, remove, form }) => (
                        <Box>
                          {suppliers && suppliers.length > 0 && (
                            <Box
                              maxH="15rem"
                              overflowY="auto"
                              border="1px solid"
                              borderColor={inputBorder}
                              borderRadius="md"
                              p="0.5rem"
                            >
                              <VStack spacing="0.5rem" align="stretch">
                                {suppliers.map((supplier: Supplier) => {
                                  const isSelected = form.values.supplierIds.includes(supplier.id);
                                  return (
                                    <HStack
                                      key={supplier.id}
                                      p="0.5rem 1rem"
                                      bg={isSelected ? selectedBg : inputBg}
                                      borderRadius="md"
                                      border="1px solid"
                                      borderColor={isSelected ? 'blue.400' : 'transparent'}
                                      spacing="1rem"
                                      cursor="pointer"
                                      onClick={() => {
                                        if (isSelected) {
                                          const index = form.values.supplierIds.indexOf(supplier.id);
                                          remove(index);
                                        } else {
                                          push(supplier.id);
                                        }
                                      }}
                                      _hover={{
                                        bg: isSelected ? selectedHoverBg : unselectedHoverBg,
                                      }}
                                      transition="all 0.2s"
                                    >
                                      <Checkbox isChecked={isSelected} onChange={() => {}} pointerEvents="none" />
                                      <VStack align="start" flex="1" spacing="0">
                                        <Text fontWeight="semibold" fontSize="sm">
                                          {supplier.name}
                                        </Text>
                                        <Text fontSize="xs" color={supplierSubtextColor}>
                                          {supplier.contactName} - {supplier.phone}
                                        </Text>
                                      </VStack>
                                    </HStack>
                                  );
                                })}
                              </VStack>
                            </Box>
                          )}
                        </Box>
                      )}
                    </FieldArray>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter pb="1.5rem">
                <Box mt="0.5rem" w="100%">
                  <Progress
                    h={isLoading ? '4px' : '1px'}
                    mb="1.25rem"
                    size="xs"
                    isIndeterminate={isLoading}
                    colorScheme="blue"
                  />

                  <Button
                    type="submit"
                    bg={buttonBg}
                    color="white"
                    disabled={isLoading}
                    _hover={{ backgroundColor: buttonHover }}
                    width="100%"
                    leftIcon={<FaCheck />}
                    fontSize="0.95rem"
                  >
                    Guardar cambios
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
