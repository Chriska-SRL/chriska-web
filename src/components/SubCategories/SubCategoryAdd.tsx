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
  useToast,
  VStack,
  Progress,
  Box,
  Text,
  Textarea,
  IconButton,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { validateEmpty } from '@/utils/validate';
import { SubCategory } from '@/entities/subcategory';
import { useAddSubCategory } from '@/hooks/subcategory';
import { Category } from '@/entities/category';

type SubCategoryAddProps = {
  category: Category;
};

export const SubCategoryAdd = ({ category }: SubCategoryAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [subCategoryProps, setSubCategoryProps] = useState<Partial<SubCategory>>();
  const { data, error, isLoading } = useAddSubCategory(subCategoryProps);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Subcategoría creada',
        description: `La subcategoría ha sido creada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setSubCategoryProps(undefined);
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
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

  const handleSubmit = (values: { name: string; description: string }) => {
    const subcategory = {
      name: values.name,
      description: values.description,
      categoryId: category.id,
    };
    setSubCategoryProps(subcategory);
  };

  return (
    <>
      <IconButton
        aria-label="Agregar subcategoría"
        icon={<FaPlus />}
        onClick={onOpen}
        size="md"
        bg="transparent"
        _hover={{ bg: '#e0dede' }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Crear subcategoría
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ category: category.name, name: '', description: '' }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="1rem">
                    <FormControl isInvalid={submitCount > 0 && touched.category && !!errors.category}>
                      <FormLabel>Categoría</FormLabel>
                      <Field
                        as={Input}
                        name="category"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                      <FormLabel>Nombre</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                      <FormLabel>Descripción</FormLabel>
                      <Field
                        as={Textarea}
                        name="description"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoading}
                      />
                    </FormControl>

                    {submitCount > 0 && Object.keys(errors).length > 0 && (
                      <Box w="100%">
                        <Text color="red.500" fontSize="0.875rem" textAlign="left" pl="0.25rem">
                          Debe completar todos los campos
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      mb="1.5rem"
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
