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
} from '@chakra-ui/react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { Field, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { validateEmpty } from '@/utils/validate';
import { useAddProduct } from '@/hooks/product';
import { useGetCategories } from '@/hooks/category';
import { Product } from '@/entities/product';

export const ProductAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [productProps, setProductProps] = useState<Partial<Product>>();
  const { data, isLoading, error, fieldError } = useAddProduct(productProps);

  const { data: categories = [], isLoading: isLoadingCats } = useGetCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.600');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Producto creado',
        description: 'El producto ha sido creado correctamente.',
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
        Crear producto
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem">
            Crear producto
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              barcode: '',
              name: '',
              price: 0,
              stock: 0,
              unitType: '',
              description: '',
              temperatureCondition: '',
              observation: '',
              subCategoryId: 0,
              image: '',
            }}
            onSubmit={(values) => setProductProps(values)}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, submitCount, values }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <VStack spacing="1rem">
                    <FormControl isInvalid={submitCount > 0 && !!errors.barcode}>
                      <FormLabel>Código de barras</FormLabel>
                      <Field
                        as={Input}
                        name="barcode"
                        bg={inputBg}
                        borderColor={inputBorder}
                        disabled={isLoading}
                        validate={(value: any) => {
                          const emptyError = validateEmpty(value);
                          if (emptyError) return emptyError;
                          const barcodeRegex = /^\d{13}$/;
                          return barcodeRegex.test(value) ? undefined : 'Debe tener exactamente 13 dígitos numéricos';
                        }}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.name}>
                      <FormLabel>Nombre</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        placeholder="Seleccionar unidad"
                        bg={inputBg}
                        borderColor={inputBorder}
                        disabled={isLoading}
                        validate={validateEmpty}
                      >
                        <option value="Kilo">Kilos</option>
                        <option value="Unit">Unidades</option>
                      </Field>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.description}>
                      <FormLabel>Descripción</FormLabel>
                      <Field
                        as={Textarea}
                        name="description"
                        bg={inputBg}
                        borderColor={inputBorder}
                        disabled={isLoading}
                        validate={validateEmpty}
                      />
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
                        validate={validateEmpty}
                      >
                        <option value="Cold">Frío</option>
                        <option value="Frozen">Congelado</option>
                        <option value="Ambient">Natural</option>
                      </Field>
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
                        onChange={(e) => {
                          const selectedId = Number(e.target.value);
                          setSelectedCategoryId(selectedId);
                          values.subCategoryId = 0;
                        }}
                        disabled={isLoading || isLoadingCats}
                      >
                        {categories.map((cat) => (
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
                        disabled={isLoading || !selectedCategoryId}
                        validate={validateEmpty}
                      >
                        {selectedCategory?.subCategories.map((sub: any) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                      </Field>
                    </FormControl>
                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
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
