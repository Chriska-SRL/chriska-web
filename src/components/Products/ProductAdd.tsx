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
} from '@chakra-ui/react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { Field, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { useAddProduct } from '@/hooks/product';
import { useGetCategories } from '@/hooks/category';
import { Product } from '@/entities/product';
import { validateEmpty } from '@/utils/validations/validateEmpty';

type ProductAddProps = {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductAdd = ({ setProducts }: ProductAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [productProps, setProductProps] = useState<Partial<Product>>();
  const { data, isLoading, error, fieldError } = useAddProduct(productProps);

  const { data: categories = [], isLoading: isLoadingCats } = useGetCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>('');
  const selectedCategory = categories.find((cat) => cat.id === Number(selectedCategoryId));

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Producto creado',
        description: 'El producto ha sido creado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setProducts((prev) => [...prev, data]);
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

  const handleClose = () => {
    setSelectedCategoryId('');
    setProductProps(undefined);
    onClose();
  };

  const handleSubmit = (values: {
    barcode: string;
    name: string;
    price: number;
    unitType: string;
    description: string;
    temperatureCondition: string;
    observation: string;
    subCategoryId: string;
    image: string;
  }) => {
    const product = {
      barcode: values.barcode,
      name: values.name,
      price: values.price,
      unitType: values.unitType,
      description: values.description,
      temperatureCondition: values.temperatureCondition,
      observation: values.observation,
      subCategoryId: Number(values.subCategoryId),
      image: values.image,
    };
    setProductProps(product);
  };

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        Agregar producto
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem">
            Nuevo producto
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              barcode: '',
              name: '',
              price: 0,
              unitType: '',
              description: '',
              temperatureCondition: '',
              observation: '',
              categoryId: '',
              subCategoryId: '',
              image: '',
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, submitCount, values, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0" maxH="70vh" overflowY="auto">
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

                    <FormControl isInvalid={submitCount > 0 && !!errors.observation}>
                      <FormLabel>Observaciones</FormLabel>
                      <Field
                        as={Textarea}
                        name="observation"
                        bg={inputBg}
                        borderColor={inputBorder}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.observation}</FormErrorMessage>
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
                      bg="#4C88D8"
                      color="white"
                      _hover={{ backgroundColor: '#376bb0' }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      py="1.375rem"
                    >
                      Confirmar
                    </Button>
                  </Box>
                </ModalFooter>
              </form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
