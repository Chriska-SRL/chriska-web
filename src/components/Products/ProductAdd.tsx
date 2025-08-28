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
  Stack,
  Checkbox,
  SimpleGrid,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiTag, FiHash, FiFileText, FiGrid, FiThermometer, FiTruck, FiDollarSign, FiBox } from 'react-icons/fi';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { validate } from '@/utils/validations/validate';
import { useAddProduct } from '@/hooks/product';
import { useGetCategories } from '@/hooks/category';
import { Product } from '@/entities/product';
import { useGetBrands } from '@/hooks/brand';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { ProductImageUpload } from './ProductImageUpload';
import { useGetSuppliers } from '@/hooks/supplier';
import { Supplier } from '@/entities/supplier';
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
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedHoverBg = useColorModeValue('blue.100', 'blue.800');
  const unselectedHoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const supplierSubtextColor = useColorModeValue('gray.600', 'gray.400');

  const [step, setStep] = useState<'form' | 'image'>('form');
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [productProps, setProductProps] = useState<Partial<Product>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddProduct(productProps);

  const { data: categories = [], isLoading: isLoadingCats } = useGetCategories();
  const { data: brands = [] } = useGetBrands();
  const { data: suppliers = [] } = useGetSuppliers(1, 100);
  const { data: warehouses = [], isLoading: isLoadingWarehouses } = useGetWarehousesSimple();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('');
  const selectedCategory = categories.find((cat) => cat.id === Number(selectedCategoryId));
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>('');

  const shelveFilters = useMemo(() => {
    return selectedWarehouseId && selectedWarehouseId !== '' ? { warehouseId: Number(selectedWarehouseId) } : undefined;
  }, [selectedWarehouseId]);

  const { data: shelves = [] } = useGetShelves(1, 100, shelveFilters);

  const handleClose = () => {
    setStep('form');
    setCreatedProduct(null);
    setSelectedCategoryId('');
    setSelectedWarehouseId('');
    setProductProps(undefined);
    setShowConfirmDialog(false);
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
      setProductProps(undefined);
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

  const handleSubmit = (values: {
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
    setProductProps(product as any);
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
        size={{ base: 'xs', md: 'xl' }}
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
                      <form id="product-add-form" onSubmit={handleSubmit}>
                        <VStack spacing="1rem" align="stretch">
                          <Field name="barcode">
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.barcode && !!errors.barcode}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiHash} boxSize="1rem" />
                                    <Text>Código de barras</Text>
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
                                    <Icon as={FiTag} boxSize="1rem" />
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
                                      <Icon as={FiDollarSign} boxSize="1rem" />
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
                                      <Icon as={FiGrid} boxSize="1rem" />
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
                                      <Icon as={FiBox} boxSize="1rem" />
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
                                      <Icon as={FiTag} boxSize="1rem" />
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
                                      <Icon as={FiThermometer} boxSize="1rem" />
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
                                    <Icon as={FiFileText} boxSize="1rem" />
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
                            <Field name="categoryId">
                              {({ field }: any) => (
                                <FormControl isInvalid={submitCount > 0 && touched.categoryId && !!errors.categoryId}>
                                  <FormLabel fontWeight="semibold">
                                    <HStack spacing="0.5rem">
                                      <Icon as={FiGrid} boxSize="1rem" />
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
                                      <Icon as={FiGrid} boxSize="1rem" />
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
                                      <Icon as={FiBox} boxSize="1rem" />
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
                                      <Icon as={FiBox} boxSize="1rem" />
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
                                <Icon as={FiTruck} boxSize="1rem" />
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
                                              <Checkbox
                                                isChecked={isSelected}
                                                onChange={() => {}}
                                                pointerEvents="none"
                                              />
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

                          <Field name="observations">
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiFileText} boxSize="1rem" />
                                    <Text>Observaciones</Text>
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
                    <ProductImageUpload
                      product={createdProduct}
                      onImageChange={handleImageChange}
                      editable={!hasImage}
                    />
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
