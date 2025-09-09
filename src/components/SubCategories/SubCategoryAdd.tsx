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
  Textarea,
  useToast,
  VStack,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  IconButton,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiTag, FiFileText, FiGrid } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { SubCategory } from '@/entities/subcategory';
import { useAddSubCategory } from '@/hooks/subcategory';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Category } from '@/entities/category';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type SubCategoryAddProps = {
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

type SubCategoryAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const SubCategoryAddModal = ({ isOpen, onClose, category, setCategories }: SubCategoryAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useAddSubCategory();

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

  useEffect(() => {
    if (data) {
      toast({
        title: 'Subcategoría creada',
        description: 'La subcategoría ha sido creada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setCategories((prev) =>
        prev.map((cat) => (cat.id === category.id ? { ...cat, subCategories: [...cat.subCategories, data] } : cat)),
      );
      onClose();
    }
  }, [data, setCategories, toast, onClose, category.id]);

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

  const handleSubmit = async (values: Partial<SubCategory>) => {
    const subcategory = {
      ...values,
      categoryId: category.id,
    };
    await mutate(subcategory);
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
            Nueva subcategoría
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                name: '',
                description: '',
              }}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="subcategory-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiGrid} boxSize="1rem" />
                            <Text>Categoría</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          value={category.name}
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          disabled
                        />
                      </FormControl>

                      <Field name="name" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
                                <Text>Nombre</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el nombre de la subcategoría"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="description" validate={validateEmpty}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Descripción</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese una descripción de la subcategoría"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={4}
                            />
                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="subcategory-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear subcategoría
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

// Componente principal que controla la apertura del modal
export const SubCategoryAdd = ({ category, setCategories }: SubCategoryAddProps) => {
  const canCreateCategories = useUserStore((s) => s.hasPermission(Permission.CREATE_CATEGORIES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');

  if (!canCreateCategories) return null;

  return (
    <>
      <IconButton
        aria-label="Agregar subcategoría"
        icon={<FaPlus />}
        onClick={onOpen}
        size="md"
        bg="transparent"
        _hover={{ bg: iconHoverBg }}
      />

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && (
        <SubCategoryAddModal isOpen={isOpen} onClose={onClose} category={category} setCategories={setCategories} />
      )}
    </>
  );
};
