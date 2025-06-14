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
  IconButton,
  Textarea,
  Flex,
  ModalCloseButton,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { validateEmpty } from '@/utils/validate';
import { SubCategory } from '@/entities/subcategory';
import { useUpdateSubCategory } from '@/hooks/subcategory';
import { SubCategoryDelete } from './SubCategoryDelete';

type SubCategoryEditProps = {
  subcategory: SubCategory;
};

export const SubCategoryEdit = ({ subcategory }: SubCategoryEditProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [subCategoryProps, setSubCategoryProps] = useState<Partial<SubCategory>>();
  const { data, isLoading, error, fieldError } = useUpdateSubCategory(subCategoryProps);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Subcategoría actualizada',
        description: `La subcategoría ha sido modificada correctamente.`,
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
    const updatedSubCategory = {
      id: subcategory.id,
      name: values.name,
      description: values.description,
      categoryId: subcategory.category.id,
    };
    setSubCategoryProps(updatedSubCategory);
  };

  return (
    <>
      <IconButton
        aria-label="Editar subcategoría"
        icon={<FiEdit />}
        onClick={onOpen}
        size="md"
        bg="transparent"
        _hover={{ bg: '#e0dede' }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Editar subcategoría
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ name: subcategory.name, description: subcategory.description }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="1rem">
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
                    <Flex gap="1rem" align={{ base: 'stretch', md: 'center' }} w="100%">
                      <SubCategoryDelete subcategory={subcategory} isUpdating={isLoading} onDeleted={onClose} />
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
                    </Flex>
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
