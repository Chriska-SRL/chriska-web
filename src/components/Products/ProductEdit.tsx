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
  Checkbox,
  Text,
  Icon,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react';
import { Field, Formik, FieldArray } from 'formik';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
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
import { Supplier } from '@/entities/supplier';
import { useGetWarehousesSimple } from '@/hooks/warehouse';
import { useGetShelves } from '@/hooks/shelve';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

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
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedHoverBg = useColorModeValue('blue.100', 'blue.800');
  const unselectedHoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const supplierSubtextColor = useColorModeValue('gray.600', 'gray.400');
  const iconColor = useColorModeValue('gray.500', 'gray.400');

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
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(product?.shelve?.warehouse?.id ?? null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

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
    setProductProps(undefined);
    setCurrentImageUrl(product?.imageUrl || null);
    setSelectedCategoryId(product?.subCategory?.category?.id ?? null);
    setSelectedWarehouseId(product?.shelve?.warehouse?.id ?? null);
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

  const handleSubmit = (values: {
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
    const { supplierIds, ...productData } = values;
    setProductProps({
      ...productData,
      supplierIds: supplierIds,
    } as any);
  };

  if (!product) return null;

  const finalImageUrl = currentImageUrl || product.imageUrl;

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
            >
              {({ handleSubmit, errors, touched, submitCount, setFieldValue, dirty, resetForm }) => {
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

                        <FormControl isInvalid={submitCount > 0 && touched.estimatedWeight && !!errors.estimatedWeight}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiBox} boxSize="1rem" color={iconColor} />
                              <Text>Peso estimado</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Input}
                            name="estimatedWeight"
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
                      </SimpleGrid>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="0.75rem">
                        <FormControl isInvalid={submitCount > 0 && touched.brandId && !!errors.brandId}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiTag} boxSize="1rem" color={iconColor} />
                              <Text>Marca</Text>
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
                              <Text>Condición de temperatura</Text>
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
