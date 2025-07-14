'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Progress,
  Box,
  Textarea,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { Category } from '@/entities/category';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { SubCategory } from '@/entities/subcategory';
import { useUpdateSubCategory } from '@/hooks/subcategory';

type CategoryEditProps = {
  isOpen: boolean;
  onClose: () => void;
  subcategory: SubCategory;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const SubCategoryEdit = ({ isOpen, onClose, subcategory, setCategories }: CategoryEditProps) => {
  const toast = useToast();
  const [subCategoryProps, setSubCategoryProps] = useState<Partial<Category>>();
  const { data, isLoading, error, fieldError } = useUpdateSubCategory(subCategoryProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Subcategoría actualizada',
        description: 'La subcategoría ha sido modificada correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === data.category.id
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) => (sub.id === data.id ? data : sub)),
              }
            : cat,
        ),
      );
      setSubCategoryProps(undefined);
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

  const handleSubmit = (values: { id: number; name: string; description: string }) => {
    const updatedCategory = {
      id: values.id,
      name: values.name,
      description: values.description,
    };
    setSubCategoryProps(updatedCategory);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0">
          Editar subcategoría
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ id: subcategory.id, name: subcategory.name, description: subcategory.description }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody
                pb="0"
                maxH="31rem"
                overflow="auto"
                sx={{
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <VStack spacing="0.75rem">
                  <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                    <FormLabel>Nombre</FormLabel>
                    <Field
                      as={Input}
                      name="name"
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                    <FormLabel>Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      name="description"
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
                      validate={validateEmpty}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter pb="1.5rem">
                <Box mt="0.25rem" w="100%">
                  <Progress
                    h={isLoading ? '4px' : '1px'}
                    mb="1.25rem"
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
                    fontSize="1rem"
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
