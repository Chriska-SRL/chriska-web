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
  Textarea,
  useColorModeValue,
  FormErrorMessage,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiGrid, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { validate } from '@/utils/validations/validate';
import { Category } from '@/entities/category';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useUpdateSubCategory();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

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

  const handleSubmit = async (values: { id: number; name: string; description: string }) => {
    const updatedCategory = {
      id: values.id,
      name: values.name,
      description: values.description,
    };
    await mutate(updatedCategory);
  };

  const handleClose = () => {
    setShowConfirmDialog(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'md' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
      >
        <ModalOverlay />
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Editar subcategoría
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{ id: subcategory.id, name: subcategory.name, description: subcategory.description }}
              onSubmit={handleSubmit}
              validateOnChange
              validateOnBlur={false}
            >
              {({ handleSubmit, errors, touched, submitCount, dirty, resetForm }) => {
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="subcategory-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="0.75rem">
                      <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiGrid} boxSize="1rem" />
                            <Text>Nombre</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="name"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validate}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Descripción</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="description"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          validate={validateEmpty}
                          disabled={isLoading}
                          rows={4}
                        />
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm" leftIcon={<FaTimes />}>
                Cancelar
              </Button>
              <Button
                form="subcategory-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Guardando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Guardar cambios
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};
