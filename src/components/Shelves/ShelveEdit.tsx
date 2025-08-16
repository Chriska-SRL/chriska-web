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
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Textarea,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiBox, FiFileText } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Shelve } from '@/entities/shelve';
import { validate } from '@/utils/validations/validate';
import { useUpdateShelve } from '@/hooks/shelve';
import { Warehouse } from '@/entities/warehouse';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ShelveEditProps = {
  isOpen: boolean;
  onClose: () => void;
  shelve: Shelve;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const ShelveEdit = ({ isOpen, onClose, shelve, setWarehouses }: ShelveEditProps) => {
  const toast = useToast();
  const [shelveProps, setShelveProps] = useState<Partial<Shelve>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useUpdateShelve(shelveProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Estantería actualizada',
        description: 'La estantería se modificó correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });

      setWarehouses((prev) =>
        prev.map((w) => {
          if (w.id === shelve.warehouse.id) {
            return {
              ...w,
              shelves: w.shelves.map((s) => (s.id === data.id ? data : s)),
            };
          }
          return w;
        }),
      );
      setShelveProps(undefined);
      handleClose();
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

  const handleClose = () => {
    setShelveProps(undefined);
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

  const handleSubmit = (values: { id: number; name: string; description: string }) => {
    const newShelve = {
      id: values.id,
      name: values.name,
      description: values.description,
      warehouseId: shelve.warehouse.id,
    };
    setShelveProps(newShelve);
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
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Editar estantería
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              id: shelve.id,
              name: shelve.name,
              description: shelve.description,
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount, dirty, resetForm }) => {
              // Actualizar la instancia de formik solo cuando cambie
              useEffect(() => {
                setFormikInstance({ dirty, resetForm });
              }, [dirty, resetForm]);

              return (
                <form onSubmit={handleSubmit}>
                  <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
                    <VStack spacing="0.75rem">
                      <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiBox} boxSize="1rem" />
                            <Text>Nombre</Text>
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
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="description"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="5rem"
                          validate={validateEmpty}
                          disabled={isLoading}
                          rows={4}
                        />
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>
                    </VStack>
                  </ModalBody>

                  <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
                    <HStack spacing="0.5rem">
                      <Button
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isLoading}
                        size="sm"
                        leftIcon={<FaTimes />}
                      >
                        Cancelar
                      </Button>
                      <Button
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
                </form>
              );
            }}
          </Formik>
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
