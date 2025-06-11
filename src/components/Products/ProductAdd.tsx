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
} from '@chakra-ui/react';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { Field, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { validateEmpty } from '@/utils/validate';
import { useAddProduct } from '@/hooks/product';
import { useGetSubCategories } from '@/hooks/subcategory';
import { Product } from '@/entities/product';

export const ProductAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [productProps, setProductProps] = useState<any>();
  const { data, error, isLoading } = useAddProduct(productProps);
  const { data: subCategories, isLoading: isLoadingSubCats } = useGetSubCategories();
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error]);

  const handleSubmit = async (values: any) => {
    if (!imageFile) return toast({ title: 'Falta la imagen', status: 'error' });

    const formData = new FormData();
    formData.append('image', imageFile);
    Object.keys(values).forEach((key) => formData.append(key, values[key]));

    setProductProps(formData);
  };

  return (
    <>
      <Button
        bg="#f2f2f2"
        _hover={{ bg: '#e0dede' }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        Crear producto
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem">
            Crear producto
          </ModalHeader>
          <Formik
            initialValues={{
              internalCode: '',
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
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <VStack spacing="1rem">
                    <FormControl isRequired>
                      <FormLabel>Imagen</FormLabel>
                      <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.internalCode}>
                      <FormLabel>Código interno</FormLabel>
                      <Field
                        as={Input}
                        name="internalCode"
                        validate={validateEmpty}
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.barcode}>
                      <FormLabel>Código de barras</FormLabel>
                      <Field
                        as={Input}
                        name="barcode"
                        validate={validateEmpty}
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.name}>
                      <FormLabel>Nombre</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        validate={validateEmpty}
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.price}>
                      <FormLabel>Precio</FormLabel>
                      <Field
                        as={Input}
                        name="price"
                        type="number"
                        validate={validateEmpty}
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.stock}>
                      <FormLabel>Stock</FormLabel>
                      <Field
                        as={Input}
                        name="stock"
                        type="number"
                        validate={validateEmpty}
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.unitType}>
                      <FormLabel>Unidad</FormLabel>
                      <Field
                        as={Input}
                        name="unitType"
                        validate={validateEmpty}
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Descripción</FormLabel>
                      <Field as={Textarea} name="description" bg="#f5f5f7" borderColor="#f5f5f7" />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Condición de temperatura</FormLabel>
                      <Field as={Input} name="temperatureCondition" bg="#f5f5f7" borderColor="#f5f5f7" />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Observaciones</FormLabel>
                      <Field as={Textarea} name="observation" bg="#f5f5f7" borderColor="#f5f5f7" />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && !!errors.subCategoryId}>
                      <FormLabel>Subcategoría</FormLabel>
                      <Field
                        as={Select}
                        name="subCategoryId"
                        placeholder="Seleccionar subcategoría"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        validate={validateEmpty}
                        disabled={isLoading || isLoadingSubCats}
                      >
                        {subCategories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
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
