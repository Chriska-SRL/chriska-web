'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
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
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiTag, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Category } from '@/entities/category';
import { useAddCategory } from '@/hooks/category';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type CategoryAddProps = {
  isLoading: boolean;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

type CategoryAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const CategoryAddModal = ({ isOpen, onClose, setCategories }: CategoryAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [categoryProps, setCategoryProps] = useState<Partial<Category>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddCategory(categoryProps);

  const handleClose = () => {
    setCategoryProps(undefined);
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
        title: 'Categoría creada',
        description: 'La categoría ha sido creada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setCategoryProps(undefined);
      setCategories((prev) => [...prev, data]);
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

  const handleSubmit = (values: Partial<Category>) => {
    setCategoryProps(values);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'md' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
      >
        <ModalOverlay />
        <ModalContent maxH="90vh" display="flex" flexDirection="column">
          <ModalHeader
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Nueva categoría
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                name: '',
                description: '',
              }}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ handleSubmit, dirty, resetForm }) => {
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="category-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field name="name" validate={validate}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
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
                              placeholder="Ingrese una descripción de la categoría"
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
                form="category-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear categoría
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
export const CategoryAdd = ({ isLoading: isLoadingCategories, setCategories }: CategoryAddProps) => {
  const canCreateCategories = useUserStore((s) => s.hasPermission(Permission.CREATE_CATEGORIES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateCategories) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingCategories}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <CategoryAddModal isOpen={isOpen} onClose={onClose} setCategories={setCategories} />}
    </>
  );
};
