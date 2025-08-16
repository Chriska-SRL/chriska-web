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
  Select,
  Box,
  Stack,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { FiUser, FiHash, FiMapPin, FiPhone, FiMail, FiHome, FiFileText, FiDollarSign } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Supplier } from '@/entities/supplier';
import { BankAccount } from '@/entities/bankAccount';
import { useAddSupplier } from '@/hooks/supplier';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { BankOptions } from '@/enums/bank.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type SupplierAddProps = {
  isLoading: boolean;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
};

type SupplierAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const SupplierAddModal = ({ isOpen, onClose, setSuppliers }: SupplierAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [supplierProps, setSupplierProps] = useState<Partial<Supplier>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddSupplier(supplierProps);

  const handleClose = () => {
    setSupplierProps(undefined);
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
        title: 'Proveedor creado',
        description: 'El proveedor ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setSupplierProps(undefined);
      setSuppliers((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setSuppliers, toast, onClose]);

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

  const handleSubmit = (values: any) => {
    setSupplierProps({
      ...values,
      bankAccounts: values.bankAccounts || [],
    });
  };

  const validate = (values: any) => {
    const errors: any = {};

    const nameError = validateEmpty(values.name);
    if (nameError) errors.name = nameError;

    const razonSocialError = validateEmpty(values.razonSocial);
    if (razonSocialError) errors.razonSocial = razonSocialError;

    const addressError = validateEmpty(values.address);
    if (addressError) errors.address = addressError;

    const mapsAddressError = validateEmpty(values.mapsAddress);
    if (mapsAddressError) errors.mapsAddress = mapsAddressError;

    const contactNameError = validateEmpty(values.contactName);
    if (contactNameError) errors.contactName = contactNameError;

    if (!values.rut || values.rut.trim() === '') {
      errors.rut = 'Campo obligatorio';
    } else if (!/^\d+$/.test(values.rut)) {
      errors.rut = 'El RUT debe contener solo números';
    } else if (values.rut.length !== 12) {
      errors.rut = 'El RUT debe tener exactamente 12 dígitos';
    }

    if (!values.phone || values.phone.trim() === '') {
      errors.phone = 'Campo obligatorio';
    } else if (!/^\d+$/.test(values.phone)) {
      errors.phone = 'El teléfono debe contener solo números';
    }

    if (!values.email || values.email.trim() === '') {
      errors.email = 'Campo obligatorio';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Email inválido';
    }

    return errors;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'xl' }}
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
            Nuevo proveedor
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                name: '',
                rut: '',
                razonSocial: '',
                address: '',
                mapsAddress: '',
                phone: '',
                contactName: '',
                email: '',
                bankAccounts: [],
                observations: '',
              }}
              onSubmit={handleSubmit}
              validate={validate}
              enableReinitialize
            >
              {({ handleSubmit, values, dirty, resetForm }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="supplier-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Stack direction={{ base: 'column', md: 'row' }} spacing="1rem">
                        <Field name="name">
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Nombre</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                placeholder="Ingrese el nombre del proveedor"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="rut">
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiHash} boxSize="1rem" />
                                  <Text>RUT</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                placeholder="Ingrese el RUT"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>

                      <Field name="razonSocial">
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Razón Social</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese la razón social"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="address">
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiHome} boxSize="1rem" />
                                <Text>Dirección</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese la dirección"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="mapsAddress">
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiMapPin} boxSize="1rem" />
                                <Text>Dirección Maps</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese la dirección para Maps"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Stack direction={{ base: 'column', md: 'row' }} spacing="1rem">
                        <Field name="phone">
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiPhone} boxSize="1rem" />
                                  <Text>Teléfono</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                placeholder="Ingrese el teléfono"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="contactName">
                          {({ field, meta }: any) => (
                            <FormControl isInvalid={meta.error && meta.touched}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Persona de contacto</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                placeholder="Ingrese el nombre del contacto"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{meta.error}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>

                      <Field name="email">
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiMail} boxSize="1rem" />
                                <Text>Email</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el email"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{meta.error}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiDollarSign} boxSize="1rem" />
                            <Text>Cuentas bancarias</Text>
                          </HStack>
                        </FormLabel>
                        <FieldArray name="bankAccounts">
                          {({ push, remove }) => (
                            <VStack spacing="0.75rem" align="stretch">
                              {values.bankAccounts.map((_account: BankAccount, index: number) => (
                                <Box
                                  key={index}
                                  p="1rem"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  borderRadius="lg"
                                  position="relative"
                                >
                                  <VStack spacing="0.5rem">
                                    <FormControl>
                                      <FormLabel fontSize="sm">Nombre de cuenta</FormLabel>
                                      <Field
                                        as={Input}
                                        name={`bankAccounts.${index}.accountName`}
                                        bg={inputBg}
                                        borderColor={inputBorder}
                                        size="sm"
                                        borderRadius="md"
                                        disabled={isLoading}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Banco</FormLabel>
                                      <Field
                                        as={Select}
                                        name={`bankAccounts.${index}.bank`}
                                        bg={inputBg}
                                        borderColor={inputBorder}
                                        size="sm"
                                        borderRadius="md"
                                        disabled={isLoading}
                                      >
                                        <option value="">Seleccionar banco</option>
                                        {BankOptions.map((bank) => (
                                          <option key={bank} value={bank}>
                                            {bank}
                                          </option>
                                        ))}
                                      </Field>
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Número de cuenta</FormLabel>
                                      <Field
                                        as={Input}
                                        name={`bankAccounts.${index}.accountNumber`}
                                        bg={inputBg}
                                        borderColor={inputBorder}
                                        size="sm"
                                        borderRadius="md"
                                        disabled={isLoading}
                                      />
                                    </FormControl>
                                  </VStack>
                                  <Button
                                    position="absolute"
                                    top="0.5rem"
                                    right="0.5rem"
                                    size="xs"
                                    colorScheme="red"
                                    variant="ghost"
                                    onClick={() => remove(index)}
                                    disabled={isLoading}
                                  >
                                    <FaTrash />
                                  </Button>
                                </Box>
                              ))}
                              <Button
                                type="button"
                                size="sm"
                                leftIcon={<FaPlus />}
                                onClick={() => push({ accountName: '', bank: '', accountNumber: '' })}
                                variant="ghost"
                                disabled={isLoading}
                              >
                                Agregar cuenta bancaria
                              </Button>
                            </VStack>
                          )}
                        </FieldArray>
                      </FormControl>

                      <Field name="observations">
                        {({ field, meta }: any) => (
                          <FormControl isInvalid={meta.error && meta.touched}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Observaciones</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese observaciones adicionales"
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
                form="supplier-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear proveedor
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
export const SupplierAdd = ({ isLoading: isLoadingSuppliers, setSuppliers }: SupplierAddProps) => {
  const canCreateSuppliers = useUserStore((s) => s.hasPermission(Permission.CREATE_SUPPLIERS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateSuppliers) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingSuppliers}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <SupplierAddModal isOpen={isOpen} onClose={onClose} setSuppliers={setSuppliers} />}
    </>
  );
};
