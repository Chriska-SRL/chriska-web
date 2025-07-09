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
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { SubCategory } from '@/entities/subcategory';
import { useAddSubCategory } from '@/hooks/subcategory';
import { Category } from '@/entities/category';
import { useUserStore } from '@/stores/useUserStore';
import { PermissionId } from '@/entities/permissions/permissionId';

type SubCategoryAddProps = {
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export const SubCategoryAdd = ({ category, setCategories }: SubCategoryAddProps) => {
  const canCreateCategories = useUserStore((s) => s.hasPermission(PermissionId.CREATE_CATEGORIES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [subCategoryProps, setSubCategoryProps] = useState<Partial<SubCategory>>();
  const { data, isLoading, error, fieldError } = useAddSubCategory(subCategoryProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');
  const buttonBg = useColorModeValue('blue.500', 'blue.400');
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.500');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Subcategoría creada',
        description: `La subcategoría ha sido creada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === category.id ? { ...cat, subCategories: [...cat.subCategories, data] } : cat)),
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
    const subcategory = {
      name: values.name,
      description: values.description,
      categoryId: category.id,
    };
    setSubCategoryProps(subcategory);
  };

  return (
    <>
      {canCreateCategories && (
        <IconButton
          aria-label="Agregar subcategoría"
          icon={<FaPlus />}
          onClick={onOpen}
          size="md"
          bg="transparent"
          _hover={{ bg: iconHoverBg }}
          disabled={!canCreateCategories}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nueva subcategoría
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
                  <VStack spacing="0.75rem">
                    <FormControl isInvalid={submitCount > 0 && touched.category && !!errors.category}>
                      <FormLabel>Categoría</FormLabel>
                      <Field
                        as={Input}
                        name="category"
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
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
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={validate}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
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
                      bg={buttonBg}
                      color="white"
                      _hover={{ bg: buttonHoverBg }}
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
