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
  useToast,
  Select,
  useDisclosure,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  Checkbox,
} from '@chakra-ui/react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { Field, Formik, FieldArray } from 'formik';
import { useEffect, useState, useCallback } from 'react';
import { validate } from '@/utils/validations/validate';
import { useAddProduct } from '@/hooks/product';
import { useGetCategories } from '@/hooks/category';
import { Product } from '@/entities/product';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { useGetBrands } from '@/hooks/brand';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { ProductImageUpload } from './ProductImageUpload';
import { useGetSuppliers } from '@/hooks/supplier';
import { Supplier } from '@/entities/supplier';

type ProductAddProps = {
  isLoading: boolean;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductAdd = ({ isLoading: isLoadingProducts, setProducts }: ProductAddProps) => {
  const canCreateProducts = useUserStore((s) => s.hasPermission(Permission.CREATE_PRODUCTS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [step, setStep] = useState<'form' | 'image'>('form');
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);
  const [productProps, setProductProps] = useState<Partial<Product>>();
  const { data, isLoading, error, fieldError } = useAddProduct(productProps);

  const { data: categories = [], isLoading: isLoadingCats } = useGetCategories();
  const { data: brands = [] } = useGetBrands();
  const { data: suppliers = [] } = useGetSuppliers(1, 100);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('');
  const selectedCategory = categories.find((cat) => cat.id === Number(selectedCategoryId));

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.600');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.600', 'green.200');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedHoverBg = useColorModeValue('blue.100', 'blue.800');
  const unselectedHoverBg = useColorModeValue('gray.200', 'whiteAlpha.200');
  const supplierSubtextColor = useColorModeValue('gray.600', 'gray.400');

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

  const handleClose = () => {
    setStep('form');
    setCreatedProduct(null);
    setSelectedCategoryId('');
    setProductProps(undefined);
    onClose();
  };

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
    description: string;
    temperatureCondition: string;
    observations: string;
    subCategoryId: string;
    brandId: string;
    supplierIds: number[];
  }) => {
    const product = {
      barcode: values.barcode,
      name: values.name,
      price: values.price,
      unitType: values.unitType,
      description: values.description,
      temperatureCondition: values.temperatureCondition,
      observations: values.observations,
      subCategoryId: Number(values.subCategoryId),
      brandId: Number(values.brandId),
      supplierIds: values.supplierIds,
    };
    setProductProps(product);
  };

  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (createdProduct?.imageUrl) {
      setHasImage(true);
    }
  }, [createdProduct?.imageUrl]);

  return (
    <>
      {canCreateProducts && (
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
      )}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'sm' }}
        isCentered
        closeOnOverlayClick={step === 'form'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            {step === 'form' ? 'Nuevo producto' : 'Producto creado'}
          </ModalHeader>
          <ModalCloseButton />

          {step === 'form' ? (
            <Formik
              initialValues={{
                barcode: '',
                name: '',
                price: 0,
                unitType: '',
                description: '',
                temperatureCondition: '',
                observations: '',
                categoryId: '',
                subCategoryId: '',
                brandId: '',
                supplierIds: [],
              }}
              onSubmit={handleSubmit}
              validateOnChange
              validateOnBlur={false}
            >
              {({ handleSubmit, errors, submitCount, setFieldValue }) => (
                <form onSubmit={handleSubmit}>
                  <ModalBody pb="0" maxH="70dvh" overflowY="auto">
                    <VStack spacing="0.75rem">
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
                          placeholder="Seleccionar unidad"
                          bg={inputBg}
                          borderColor={inputBorder}
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

                      <FormControl isInvalid={submitCount > 0 && !!errors.temperatureCondition}>
                        <FormLabel>Condición de temperatura</FormLabel>
                        <Field
                          as={Select}
                          name="temperatureCondition"
                          placeholder="Seleccione una opción"
                          bg={inputBg}
                          borderColor={inputBorder}
                          disabled={isLoading}
                          validate={validate}
                        >
                          <option value="Cold">Frío</option>
                          <option value="Frozen">Congelado</option>
                          <option value="Ambient">Natural</option>
                        </Field>
                        <FormErrorMessage>{errors.temperatureCondition}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && !!errors.brandId}>
                        <FormLabel>Marca</FormLabel>
                        <Field
                          as={Select}
                          name="brandId"
                          placeholder="Seleccione una marca"
                          bg={inputBg}
                          borderColor={inputBorder}
                          disabled={isLoading}
                          validate={validate}
                        >
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))}
                        </Field>
                        <FormErrorMessage>{errors.brandId}</FormErrorMessage>
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

                      <FormControl isInvalid={submitCount > 0 && !!errors.categoryId}>
                        <FormLabel>Categoría</FormLabel>
                        <Field
                          as={Select}
                          name="categoryId"
                          placeholder="Seleccionar categoría"
                          bg={inputBg}
                          borderColor={inputBorder}
                          value={selectedCategoryId}
                          disabled={isLoading || isLoadingCats}
                          onChange={(e: any) => {
                            const selectedId = e.target.value;
                            setFieldValue('categoryId', selectedId);
                            setFieldValue('subCategoryId', '');
                            setSelectedCategoryId(selectedId);
                          }}
                          validate={validateEmpty}
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </Field>
                        <FormErrorMessage>{errors.categoryId}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && !!errors.subCategoryId}>
                        <FormLabel>Subcategoría</FormLabel>
                        <Field
                          as={Select}
                          name="subCategoryId"
                          placeholder="Seleccionar subcategoría"
                          bg={inputBg}
                          borderColor={inputBorder}
                          disabled={isLoading || !selectedCategoryId}
                          validate={validate}
                        >
                          {selectedCategory?.subCategories.map((sub: any) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}
                            </option>
                          ))}
                        </Field>
                        <FormErrorMessage>{errors.subCategoryId}</FormErrorMessage>
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
                    <Box w="100%">
                      <Progress
                        h={isLoading ? '4px' : '1px'}
                        mb="1rem"
                        size="xs"
                        isIndeterminate={isLoading}
                        colorScheme="blue"
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        bg={submitBg}
                        color="white"
                        _hover={{ backgroundColor: submitHover }}
                        width="100%"
                        leftIcon={<FaCheck />}
                        py="1.375rem"
                      >
                        Crear producto
                      </Button>
                    </Box>
                  </ModalFooter>
                </form>
              )}
            </Formik>
          ) : (
            <>
              <ModalBody pb="0">
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

              <ModalFooter pb="1.5rem">
                <VStack w="100%" spacing="0.75rem">
                  {hasImage ? (
                    <Button
                      bg={submitBg}
                      color="white"
                      _hover={{ backgroundColor: submitHover }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      onClick={handleFinishWithImage}
                    >
                      Finalizar
                    </Button>
                  ) : (
                    <Button
                      variant="fill"
                      color="white"
                      _hover={{ backgroundColor: buttonHover }}
                      width="100%"
                      onClick={handleSkipImage}
                    >
                      Omitir imagen por ahora
                    </Button>
                  )}
                </VStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
