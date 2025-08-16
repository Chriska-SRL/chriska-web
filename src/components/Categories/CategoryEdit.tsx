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
  Box,
  Textarea,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiGrid, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { Category } from '@/entities/category';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { useUpdateCategory } from '@/hooks/category';

type CategoryEditProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const CategoryEditForm = ({
  isOpen,
  onClose,
  category,
  setCategories,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
}) => {
  const toast = useToast();
  const [categoryProps, setCategoryProps] = useState<Partial<Category>>();
  const { data, isLoading, error, fieldError } = useUpdateCategory(categoryProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Categoría actualizada',
        description: 'La categoría ha sido actualizada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
      setCategoryProps(undefined);
      onClose();
    }
  }, [data, setCategories, toast, onClose]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: 'Error',
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
  }, [error, fieldError, toast]);

  const handleSubmit = (values: { id: number; name: string; description: string }) => {
    const updatedCategory = {
      id: values.id,
      name: values.name,
      description: values.description,
    };
    setCategoryProps(updatedCategory);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered closeOnOverlayClick={false}>
      <ModalOverlay />
      <ModalContent maxH="90dvh" display="flex" flexDirection="column">
        <ModalHeader
          textAlign="center"
          fontSize="1.5rem"
          flexShrink={0}
          borderBottom="1px solid"
          borderColor={inputBorder}
        >
          Editar categoría
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
          <Formik
            initialValues={{
              id: category.id,
              name: category.name,
              description: category.description,
            }}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit }) => (
              <form id="category-edit-form" onSubmit={handleSubmit}>
                <Box>
                  <VStack spacing="1rem" align="stretch">
                    <Field name="name" validate={validate}>
                      {({ field, meta }: any) => (
                        <FormControl isInvalid={meta.error && meta.touched}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiGrid} boxSize="1rem" />
                              <Text>Nombre</Text>
                            </HStack>
                          </FormLabel>
                          <Input
                            {...field}
                            placeholder="Ingrese el nombre de la categoría"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>

                    <Field name="description" validate={validateEmpty}>
                      {({ field, meta }: any) => (
                        <FormControl isInvalid={meta.error && meta.touched}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiFileText} boxSize="1rem" />
                              <Text>Descripción</Text>
                            </HStack>
                          </FormLabel>
                          <Textarea
                            {...field}
                            placeholder="Ingrese la descripción de la categoría"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            disabled={isLoading}
                            rows={4}
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </VStack>
                </Box>
              </form>
            )}
          </Formik>
        </ModalBody>

        <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
          <HStack spacing="0.5rem">
            <Button variant="ghost" onClick={onClose} disabled={isLoading} size="sm" leftIcon={<FaTimes />}>
              Cancelar
            </Button>
            <Button
              form="category-edit-form"
              type="submit"
              colorScheme="blue"
              variant="outline"
              isLoading={isLoading}
              loadingText="Actualizando..."
              leftIcon={<FaCheck />}
              size="sm"
            >
              Actualizar categoría
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

// Componente principal que controla cuándo renderizar el formulario
export const CategoryEdit = ({ isOpen, onClose, category, setCategories }: CategoryEditProps) => {
  // Solo renderizar el formulario cuando el modal está abierto y hay category
  if (!isOpen || !category) return null;

  return <CategoryEditForm isOpen={isOpen} onClose={onClose} category={category} setCategories={setCategories} />;
};
