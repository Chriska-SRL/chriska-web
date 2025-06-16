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
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { validateEmpty } from '@/utils/validate';
import { Category } from '@/entities/category';
import { useAddCategory } from '@/hooks/category';

type CategoryAddProps = {
  setLocalCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const CategoryAdd = ({ setLocalCategories }: CategoryAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [categoryProps, setCategoryProps] = useState<Partial<Category>>();
  const { data, isLoading, error, fieldError } = useAddCategory(categoryProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const hoverBg = useColorModeValue('#e0dede', 'gray.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Categoría creada',
        description: `La categoría ha sido creada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalCategories((prev) => [...prev, data]);
      setCategoryProps(undefined);
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

  const handleSubmit = (values: { name: string; description: string }) => {
    const category = {
      name: values.name,
      description: values.description,
    };
    setCategoryProps(category);
  };

  return (
    <>
      <Button
        bg={inputBg}
        _hover={{ bg: hoverBg }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        Crear categoría
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Crear categoría
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ name: '', description: '' }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => {
              const showError = (field: keyof typeof errors) => submitCount > 0 && touched[field] && !!errors[field];

              return (
                <form onSubmit={handleSubmit}>
                  <ModalBody pb="0">
                    <VStack spacing="1rem">
                      <FormControl isInvalid={showError('name')}>
                        <FormLabel>Nombre</FormLabel>
                        <Field
                          as={Input}
                          name="name"
                          type="text"
                          bg={inputBg}
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validateEmpty}
                          disabled={isLoading}
                        />
                      </FormControl>

                      <FormControl isInvalid={showError('description')}>
                        <FormLabel>Descripción</FormLabel>
                        <Field
                          as={Textarea}
                          name="description"
                          type="text"
                          bg={inputBg}
                          borderColor={inputBorder}
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
              );
            }}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
