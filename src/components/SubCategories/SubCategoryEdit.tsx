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
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { validateEmpty } from '@/utils/validate';
import { SubCategory } from '@/entities/subcategory';
import { useUpdateSubCategory } from '@/hooks/subcategory';
import { SubCategoryDelete } from './SubCategoryDelete';
import { Category } from '@/entities/category';

type SubCategoryEditProps = {
  subcategory: SubCategory;
  setLocalCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const SubCategoryEdit = ({ subcategory, setLocalCategories }: SubCategoryEditProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [subCategoryProps, setSubCategoryProps] = useState<Partial<SubCategory>>();
  const { data, isLoading, error, fieldError } = useUpdateSubCategory(subCategoryProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const iconHoverBg = useColorModeValue('gray.100', 'gray.700');
  const buttonBg = useColorModeValue('blue.500', 'blue.400');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.500');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Subcategoría actualizada',
        description: `La subcategoría ha sido modificada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalCategories((prev) =>
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
        _hover={{ bg: iconHoverBg }}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Editar subcategoría
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              category: subcategory.category.name,
              name: subcategory.name,
              description: subcategory.description,
            }}
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
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        bg={inputBg}
                        borderColor={inputBorder}
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
                    <Flex gap="1rem" align={{ base: 'stretch', md: 'center' }} w="100%">
                      <SubCategoryDelete
                        subcategory={subcategory}
                        isUpdating={isLoading}
                        onDeleted={onClose}
                        setLocalCategories={setLocalCategories}
                      />
                      <Button
                        type="submit"
                        disabled={isLoading}
                        bg={buttonBg}
                        color="white"
                        _hover={{ bg: buttonHoverBg }}
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
