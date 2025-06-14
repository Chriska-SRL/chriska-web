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
  Text,
  Select,
  useToast,
  Image,
  Flex,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { Product } from '@/entities/product';
import { useUpdateProduct } from '@/hooks/product';
import { ProductDelete } from './ProductDelete';
import { validateEmpty } from '@/utils/validate';
import { useGetCategories } from '@/hooks/category';

type ProductEditProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
};

export const ProductEdit = ({ isOpen, onClose, product }: ProductEditProps) => {
  const toast = useToast();
  const [productProps, setProductProps] = useState<Partial<Product> | undefined>();
  const { data: categories, isLoading: isLoadingCats } = useGetCategories();
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
      setProductProps(undefined);
      onClose();
      setTimeout(() => window.location.reload(), 1500);
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="1.75rem">
          Editar producto
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            // internalCode: product?.internalCode ?? '',
            id: product?.id ?? 0,
            barcode: product?.barcode ?? '',
            name: product?.name ?? '',
            price: product?.price ?? 0,
            stock: product?.stock ?? 0,
            unitType: product?.unitType ?? '',
            description: product?.description ?? '',
            temperatureCondition: product?.temperatureCondition ?? '',
            observation: product?.observation ?? '',
            subCategoryId: product?.subCategory.id ?? 0,
            image: product?.image ?? '',
          }}
          onSubmit={(values) => setProductProps(values)}
          validateOnChange={true}
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing="1rem">
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

                  {/* <FormControl isInvalid={submitCount > 0 && !!errors.internalCode}>
                    <FormLabel>Código interno</FormLabel>
                    <Field
                      as={Input}
                      name="internalCode"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      validate={(value: any) => {
                        const emptyError = validateEmpty(value);
                        if (emptyError) return emptyError;
                        return value.length === 5 ? undefined : 'Debe tener exactamente 5 caracteres';
                      }}
                      disabled={isLoading}
                    />
                  </FormControl> */}

                  <FormControl isInvalid={submitCount > 0 && !!errors.barcode}>
                    <FormLabel>Código de barras</FormLabel>
                    <Field
                      as={Input}
                      name="barcode"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoading}
                      validate={(value: any) => {
                        const emptyError = validateEmpty(value);
                        if (emptyError) return emptyError;
                        const barcodeRegex = /^\d{13}$/;
                        return barcodeRegex.test(value)
                          ? undefined
                          : 'El código de barras debe tener exactamente 13 dígitos numéricos';
                      }}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.name}>
                    <FormLabel>Nombre</FormLabel>
                    <Field
                      as={Input}
                      name="name"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoading}
                      validate={validateEmpty}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.price}>
                    <FormLabel>Precio</FormLabel>
                    <Field
                      as={Input}
                      name="price"
                      type="number"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoading}
                      validate={(value: any) => {
                        const emptyError = validateEmpty(value);
                        if (emptyError) return emptyError;
                        return Number(value) > 0 ? undefined : 'El precio debe ser mayor a 0';
                      }}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.stock}>
                    <FormLabel>Stock</FormLabel>
                    <Field
                      as={Input}
                      name="stock"
                      type="number"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoading}
                      validate={(value: any) => {
                        const emptyError = validateEmpty(value);
                        if (emptyError) return emptyError;
                        return Number(value) >= 0 ? undefined : 'El stock debe ser mayor o igual a 0';
                      }}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && !!errors.unitType}>
                    <FormLabel>Unidad</FormLabel>
                    <Field
                      as={Select}
                      name="unitType"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      placeholder="Seleccione una opción"
                      disabled={isLoading}
                      validate={validateEmpty}
                    >
                      <option value="Kilo">Kilos</option>
                      <option value="Unit">Unidades</option>
                    </Field>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      name="description"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoading}
                      validate={validateEmpty}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Condición de temperatura</FormLabel>
                    <Field
                      as={Select}
                      name="temperatureCondition"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      placeholder="Seleccione una opción"
                      disabled={isLoading}
                      validate={validateEmpty}
                    >
                      <option value="Cold">Frío</option>
                      <option value="Frozen">Congelado</option>
                      <option value="Ambient">Natural</option>
                    </Field>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Observaciones</FormLabel>
                    <Field
                      as={Textarea}
                      name="observation"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoading}
                      validate={validateEmpty}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      placeholder="Seleccionar categoría"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      value={selectedCategoryId ?? ''}
                      disabled={isLoadingCats}
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
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      disabled={isLoadingCats || !selectedCategoryId}
                      validate={validateEmpty}
                    >
                      {filteredSubCategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </Field>
                  </FormControl>

                  {submitCount > 0 && Object.keys(errors).length > 0 && (
                    <Box w="100%">
                      <Text color="red.500" fontSize="0.85rem">
                        Debe completar todos los campos obligatorios.
                      </Text>
                    </Box>
                  )}
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
                  <Box display="flex" gap="0.75rem">
                    <ProductDelete product={product} onDeleted={onClose} isUpdating={isLoading} />
                    <Button
                      type="submit"
                      bg="#4C88D8"
                      color="white"
                      disabled={isLoading}
                      _hover={{ backgroundColor: '#376bb0' }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      fontSize="0.95rem"
                    >
                      Guardar cambios
                    </Button>
                  </Box>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
