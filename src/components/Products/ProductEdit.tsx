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
  Image,
  Flex,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Product } from '@/entities/product';
import { useUpdateProduct } from '@/hooks/product';
import { validate } from '@/utils/validations/validate';
import { useGetCategories } from '@/hooks/category';
import { useGetBrands } from '@/hooks/brand';

type ProductEditProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductEdit = ({ isOpen, onClose, product, setProducts }: ProductEditProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#4C88D8', 'blue.500');
  const buttonHover = useColorModeValue('#376bb0', 'blue.600');

  const [productProps, setProductProps] = useState<Partial<Product> | undefined>();
  const { data: categories, isLoading: isLoadingCats } = useGetCategories();
  const { data: brands, isLoading: isLoadingBrands } = useGetBrands();
  const { data, isLoading, error, fieldError } = useUpdateProduct(productProps);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    product?.subCategory?.category?.id ?? null,
  );

  const selectedCategory = categories?.find((c) => c.id === selectedCategoryId);
  const filteredSubCategories = selectedCategory?.subCategories ?? [];

  useEffect(() => {
    if (product?.subCategory?.category?.id) {
      setSelectedCategoryId(product.subCategory.category.id);
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
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
      setProductProps(undefined);
      onClose();
    }
  }, [data]);

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
  }, [error, fieldError]);

  if (!product) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="1.75rem">
          Editar producto
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: product?.id ?? 0,
            internalCode: product?.internalCode ?? '',
            barcode: product?.barcode ?? '',
            name: product?.name ?? '',
            price: product?.price ?? 0,
            unitType: product?.unitType ?? '',
            description: product?.description ?? '',
            temperatureCondition: product?.temperatureCondition ?? '',
            observation: product?.observation ?? '',
            subCategoryId: product?.subCategory.id ?? 0,
            brandId: product?.brand.id ?? 0,
            image: product?.image ?? '',
          }}
          onSubmit={(values) => setProductProps(values)}
          validateOnChange={true}
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0" maxH="70vh" overflowY="auto">
                <VStack spacing="0.75rem">
                  <FormControl>
                    <FormLabel>Imagen</FormLabel>
                    <Flex w="full" justifyContent="center">
                      <Image
                        src={
                          product.image !== ''
                            ? product.image
                            : 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'
                        }
                        alt={product.name}
                        maxH="20rem"
                      />
                    </Flex>
                  </FormControl>

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

                  <FormControl isInvalid={submitCount > 0 && !!errors.observation}>
                    <FormLabel>Observaciones</FormLabel>
                    <Field
                      as={Textarea}
                      name="observation"
                      bg={inputBg}
                      borderColor={inputBorder}
                      disabled={isLoading}
                    />
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
