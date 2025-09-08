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
  Select,
  Box,
  Stack,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { FiUser, FiHash, FiMapPin, FiPhone, FiMail, FiHome, FiFileText, FiDollarSign, FiMap } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Supplier } from '@/entities/supplier';
import { BankAccount } from '@/entities/bankAccount';
import { useAddSupplier } from '@/hooks/supplier';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { BankOptions } from '@/enums/bank.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { LocationPickerModal } from '@/components/LocationPickerModal';

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

  const { data, isLoading, error, fieldError, mutate } = useAddSupplier();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const [locationHandler, setLocationHandler] = useState<((lat: number, lng: number) => void) | null>(null);
  const [currentCoords, setCurrentCoords] = useState({
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const { isOpen: isLocationModalOpen, onOpen: openLocationModal, onClose: closeLocationModal } = useDisclosure();

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
        title: 'Proveedor creado',
        description: 'El proveedor ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
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

  const handleSubmit = async (values: any) => {
    const submitData: any = {
      ...values,
      bankAccounts: values.bankAccounts || [],
    };

    // Solo incluir location si se proporcionaron coordenadas
    if (values.latitude && values.longitude) {
      submitData.location = {
        latitude: values.latitude,
        longitude: values.longitude,
      };
    }

    // Eliminar latitude y longitude del objeto principal
    delete submitData.latitude;
    delete submitData.longitude;

    await mutate(submitData);
  };

  const validateForm = (values: any) => {
    const errors: any = {};

    const nameError = validateEmpty(values.name);
    if (nameError) errors.name = nameError;

    const razonSocialError = validateEmpty(values.razonSocial);
    if (razonSocialError) errors.razonSocial = razonSocialError;

    const addressError = validateEmpty(values.address);
    if (addressError) errors.address = addressError;

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

    // Validar email solo si se proporciona un valor
    if (values.email && values.email.trim() !== '' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = 'Email inválido';
    }

    // Validar cuentas bancarias
    if (values.bankAccounts && values.bankAccounts.length > 0) {
      const bankAccountsErrors: any = [];
      values.bankAccounts.forEach((account: any, index: number) => {
        const accountErrors: any = {};

        if (!account.accountName || account.accountName.trim() === '') {
          accountErrors.accountName = 'Campo obligatorio';
        }

        if (!account.bank || account.bank.trim() === '') {
          accountErrors.bank = 'Campo obligatorio';
        }

        if (!account.accountNumber || account.accountNumber.trim() === '') {
          accountErrors.accountNumber = 'Campo obligatorio';
        }

        if (Object.keys(accountErrors).length > 0) {
          bankAccountsErrors[index] = accountErrors;
        }
      });

      if (bankAccountsErrors.length > 0) {
        errors.bankAccounts = bankAccountsErrors;
      }
    }

    return errors;
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'xl' }}
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
            Nuevo proveedor
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                name: '',
                rut: '',
                razonSocial: '',
                address: '',
                phone: '',
                contactName: '',
                email: '',
                latitude: null,
                longitude: null,
                bankAccounts: [],
                observations: '',
              }}
              onSubmit={handleSubmit}
              validate={validateForm}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({
                handleSubmit,
                values,
                dirty,
                resetForm,
                errors,
                touched,
                submitCount,
                setFieldValue,
                setFieldError,
              }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="supplier-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Stack direction={{ base: 'column', md: 'row' }} spacing="1rem">
                        <Field name="name">
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Nombre</Text>
                                  <Text color="red.500">*</Text>
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
                              <FormErrorMessage>{errors.name}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="rut">
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.rut && !!errors.rut}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiHash} boxSize="1rem" />
                                  <Text>RUT</Text>
                                  <Text color="red.500">*</Text>
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
                              <FormErrorMessage>{errors.rut}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>

                      <Field name="razonSocial">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.razonSocial && !!errors.razonSocial}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Razón Social</Text>
                                <Text color="red.500">*</Text>
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
                            <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="address">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiHome} boxSize="1rem" />
                                <Text>Dirección</Text>
                                <Text color="red.500">*</Text>
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
                            <FormErrorMessage>{errors.address}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Stack direction={{ base: 'column', md: 'row' }} spacing="1rem">
                        <Field name="contactName">
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.contactName && !!errors.contactName}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Persona de contacto</Text>
                                  <Text color="red.500">*</Text>
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
                              <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="phone">
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.phone && !!errors.phone}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiPhone} boxSize="1rem" />
                                  <Text>Teléfono</Text>
                                  <Text color="red.500">*</Text>
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
                              <FormErrorMessage>{errors.phone}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </Stack>

                      <Field name="email">
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.email && !!errors.email}>
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
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      {/* Ubicación */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMap} boxSize="1rem" />
                            <Text>Ubicación</Text>
                            <Text fontSize="sm" color="gray.500"></Text>
                          </HStack>
                        </FormLabel>
                        <VStack spacing="0.5rem" align="stretch">
                          <HStack
                            p="0.75rem"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            borderRadius="md"
                            justify="space-between"
                          >
                            <VStack spacing="0.25rem" align="start">
                              <Text fontSize="sm" fontWeight="medium">
                                {values.latitude && values.longitude
                                  ? `Lat: ${Number(values.latitude).toFixed(6)}, Lng: ${Number(values.longitude).toFixed(6)}`
                                  : 'No se ha seleccionado ubicación'}
                              </Text>
                              {values.latitude && values.longitude && (
                                <Text fontSize="xs" color="gray.500">
                                  Haz clic en "Seleccionar en mapa" para cambiar
                                </Text>
                              )}
                            </VStack>
                            <Button
                              size="sm"
                              leftIcon={<FiMapPin />}
                              onClick={() => {
                                setLocationHandler(() => (lat: number, lng: number) => {
                                  setFieldValue('latitude', lat);
                                  setFieldValue('longitude', lng);
                                });
                                setCurrentCoords({
                                  lat: values.latitude || undefined,
                                  lng: values.longitude || undefined,
                                });
                                openLocationModal();
                              }}
                              disabled={isLoading}
                              colorScheme="blue"
                              variant="outline"
                            >
                              Seleccionar en mapa
                            </Button>
                          </HStack>
                        </VStack>
                      </FormControl>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiDollarSign} boxSize="1rem" />
                            <Text>Cuentas bancarias</Text>
                            <Text fontSize="sm" color="gray.500"></Text>
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
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          submitCount > 0 &&
                                          errors.bankAccounts?.[index] &&
                                          (errors.bankAccounts[index] as any)?.accountName
                                        )
                                      }
                                    >
                                      <FormLabel fontSize="sm">Nombre de cuenta</FormLabel>
                                      <Field name={`bankAccounts.${index}.accountName`}>
                                        {({ field, form }: any) => (
                                          <Input
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              // Solo permitir letras, espacios y algunos caracteres especiales
                                              const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
                                              if (regex.test(value)) {
                                                form.setFieldValue(field.name, value);
                                                // Clear error if exists
                                                if ((errors.bankAccounts?.[index] as any)?.accountName) {
                                                  setFieldError(`bankAccounts[${index}].accountName`, undefined);
                                                }
                                              }
                                            }}
                                            bg={inputBg}
                                            borderColor={inputBorder}
                                            size="sm"
                                            borderRadius="md"
                                            disabled={isLoading}
                                          />
                                        )}
                                      </Field>
                                      {submitCount > 0 &&
                                        errors.bankAccounts?.[index] &&
                                        (errors.bankAccounts[index] as any)?.accountName && (
                                          <FormErrorMessage>
                                            {(errors.bankAccounts[index] as any).accountName}
                                          </FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          submitCount > 0 &&
                                          errors.bankAccounts?.[index] &&
                                          (errors.bankAccounts[index] as any)?.bank
                                        )
                                      }
                                    >
                                      <FormLabel fontSize="sm">Banco</FormLabel>
                                      <Field name={`bankAccounts.${index}.bank`}>
                                        {({ field }: any) => (
                                          <Select
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setFieldValue(`bankAccounts[${index}].bank`, value);
                                              // Clear error if exists
                                              if ((errors.bankAccounts?.[index] as any)?.bank) {
                                                setFieldError(`bankAccounts[${index}].bank`, undefined);
                                              }
                                            }}
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
                                          </Select>
                                        )}
                                      </Field>
                                      {submitCount > 0 &&
                                        errors.bankAccounts?.[index] &&
                                        (errors.bankAccounts[index] as any)?.bank && (
                                          <FormErrorMessage>
                                            {(errors.bankAccounts[index] as any).bank}
                                          </FormErrorMessage>
                                        )}
                                    </FormControl>
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          submitCount > 0 &&
                                          errors.bankAccounts?.[index] &&
                                          (errors.bankAccounts[index] as any)?.accountNumber
                                        )
                                      }
                                    >
                                      <FormLabel fontSize="sm">Número de cuenta</FormLabel>
                                      <Field name={`bankAccounts.${index}.accountNumber`}>
                                        {({ field, form }: any) => (
                                          <Input
                                            {...field}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              // Solo permitir números, guiones y puntos
                                              const regex = /^[0-9.-]*$/;
                                              if (regex.test(value)) {
                                                form.setFieldValue(field.name, value);
                                                // Clear error if exists
                                                if ((errors.bankAccounts?.[index] as any)?.accountNumber) {
                                                  setFieldError(`bankAccounts[${index}].accountNumber`, undefined);
                                                }
                                              }
                                            }}
                                            bg={inputBg}
                                            borderColor={inputBorder}
                                            size="sm"
                                            borderRadius="md"
                                            disabled={isLoading}
                                          />
                                        )}
                                      </Field>
                                      {submitCount > 0 &&
                                        errors.bankAccounts?.[index] &&
                                        (errors.bankAccounts[index] as any)?.accountNumber && (
                                          <FormErrorMessage>
                                            {(errors.bankAccounts[index] as any).accountNumber}
                                          </FormErrorMessage>
                                        )}
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
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
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
                            <FormErrorMessage>{errors.observations}</FormErrorMessage>
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

      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={closeLocationModal}
        onConfirm={locationHandler || (() => {})}
        initialLat={currentCoords.lat}
        initialLng={currentCoords.lng}
      />

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
