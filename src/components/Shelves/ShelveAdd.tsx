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
import { FiTag, FiFileText, FiPackage } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Shelve } from '@/entities/shelve';
import { Warehouse } from '@/entities/warehouse';
import { useAddShelve } from '@/hooks/shelve';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ShelveAddProps = {
  warehouse: Warehouse;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

type ShelveAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const ShelveAddModal = ({ isOpen, onClose, warehouse, setWarehouses }: ShelveAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [shelveProps, setShelveProps] = useState<Partial<Shelve>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddShelve(shelveProps);

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

  useEffect(() => {
    if (data) {
      toast({
        title: 'Estantería creada',
        description: 'La estantería ha sido creada correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setShelveProps(undefined);
      setWarehouses((prev) =>
        prev.map((w) => {
          if (w.id === warehouse.id) {
            return { ...w, shelves: [...w.shelves, data] };
          }
          return w;
        }),
      );
      onClose();
    }
  }, [data, setWarehouses, toast, onClose, warehouse.id]);

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

  const handleSubmit = (values: Partial<Shelve>) => {
    const shelve = {
      ...values,
      warehouseId: warehouse.id,
    };
    setShelveProps(shelve);
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
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Nueva estantería
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
                  <form id="shelve-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiPackage} boxSize="1rem" />
                            <Text>Depósito</Text>
                          </HStack>
                        </FormLabel>
                        <Input
                          value={warehouse.name}
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          disabled
                        />
                      </FormControl>

                      <Field name="name" validate={validate}>
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiTag} boxSize="1rem" />
                                <Text>Nombre</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el nombre de la estantería"
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
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Descripción</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese una descripción de la estantería"
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
                form="shelve-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear estantería
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
export const ShelveAdd = ({ warehouse, setWarehouses }: ShelveAddProps) => {
  const canCreateWarehouses = useUserStore((s) => s.hasPermission(Permission.CREATE_WAREHOUSES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');

  if (!canCreateWarehouses) return null;

  return (
    <>
      <IconButton
        aria-label="Agregar estantería"
        icon={<FaPlus />}
        onClick={onOpen}
        size="md"
        bg="transparent"
        _hover={{ bg: iconHoverBg }}
      />

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && (
        <ShelveAddModal isOpen={isOpen} onClose={onClose} warehouse={warehouse} setWarehouses={setWarehouses} />
      )}
    </>
  );
};
