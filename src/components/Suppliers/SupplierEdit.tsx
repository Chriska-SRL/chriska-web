'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  Box,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Select,
  HStack,
  Text,
  Icon,
  Stack,
} from '@chakra-ui/react';
import { Supplier } from '@/entities/supplier';
import { BankAccount } from '@/entities/bankAccount';
import { Formik, Field, FieldArray } from 'formik';
import { FaCheck, FaPlus, FaTrash, FaTimes } from 'react-icons/fa';
import { FiUser, FiHash, FiFileText, FiMapPin, FiPhone, FiMail, FiCreditCard, FiMap } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useUpdateSupplier } from '@/hooks/supplier';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { BankOptions } from '@/enums/bank.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { useDisclosure } from '@chakra-ui/react';
import { LocationPickerModal } from '@/components/LocationPickerModal';

type SupplierEditProps = {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
};

export const SupplierEdit = ({ isOpen, onClose, supplier, setSuppliers }: SupplierEditProps) => {
  const toast = useToast();

  const [supplierProps, setSupplierProps] = useState<Partial<Supplier>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const [locationHandler, setLocationHandler] = useState<((lat: number, lng: number) => void) | null>(null);
  const [currentCoords, setCurrentCoords] = useState({
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const { isOpen: isLocationModalOpen, onOpen: openLocationModal, onClose: closeLocationModal } = useDisclosure();
  const { data, isLoading, error, fieldError } = useUpdateSupplier(supplierProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Proveedor actualizado',
        description: 'El proveedor ha sido actualizado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setSuppliers((prev) => prev.map((s) => (s.id === data.id ? { ...s, ...data } : s)));
      setSupplierProps(undefined);
      onClose();
    }
  }, [data]);

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
  }, [error, fieldError]);

  const handleSubmit = (values: any) => {
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

    setSupplierProps(submitData);
  };

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

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'lg' }}
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
            Editar proveedor
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                id: supplier?.id ?? 0,
                name: supplier?.name ?? '',
                rut: supplier?.rut ?? '',
                razonSocial: supplier?.razonSocial ?? '',
                address: supplier?.address ?? '',
                phone: supplier?.phone ?? '',
                contactName: supplier?.contactName ?? '',
                email: supplier?.email ?? '',
                latitude: supplier?.location?.latitude ?? null,
                longitude: supplier?.location?.longitude ?? null,
                bankAccounts: supplier?.bankAccounts ?? [],
                observations: supplier?.observations ?? '',
              }}
              onSubmit={handleSubmit}
              validate={(values) => {
                const errors: any = {};

                // Validate empty fields
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
                if (
                  values.email &&
                  values.email.trim() !== '' &&
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Email inválido';
                }

                return errors;
              }}
              validateOnChange
              validateOnBlur={false}
            >
              {({ handleSubmit, errors, touched, submitCount, dirty, resetForm, values, setFieldValue }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="supplier-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      {/* Fila 1: Nombre y RUT */}
                      <Stack direction={{ base: 'column', md: 'row' }} spacing="1rem">
                        <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiUser} boxSize="1rem" />
                              <Text>Nombre</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Input}
                            name="name"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            h="2.75rem"
                          />
                          <FormErrorMessage>{errors.name}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={submitCount > 0 && touched.rut && !!errors.rut}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiHash} boxSize="1rem" />
                              <Text>RUT</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Input}
                            name="rut"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            h="2.75rem"
                          />
                          <FormErrorMessage>{errors.rut}</FormErrorMessage>
                        </FormControl>
                      </Stack>

                      {/* Fila 2: Razón Social (completo) */}
                      <FormControl isInvalid={submitCount > 0 && touched.razonSocial && !!errors.razonSocial}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Razón Social</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="razonSocial"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                        />
                        <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                      </FormControl>

                      {/* Fila 3: Dirección (completo) */}
                      <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMapPin} boxSize="1rem" />
                            <Text>Dirección</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="address"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                        />
                        <FormErrorMessage>{errors.address}</FormErrorMessage>
                      </FormControl>

                      {/* Fila 4: Persona de contacto y Teléfono */}
                      <Stack direction={{ base: 'column', md: 'row' }} spacing="1rem">
                        <FormControl isInvalid={submitCount > 0 && touched.contactName && !!errors.contactName}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiUser} boxSize="1rem" />
                              <Text>Persona de contacto</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Input}
                            name="contactName"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            h="2.75rem"
                          />
                          <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={submitCount > 0 && touched.phone && !!errors.phone}>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiPhone} boxSize="1rem" />
                              <Text>Teléfono</Text>
                            </HStack>
                          </FormLabel>
                          <Field
                            as={Input}
                            name="phone"
                            bg={inputBg}
                            border="1px solid"
                            borderColor={inputBorder}
                            h="2.75rem"
                          />
                          <FormErrorMessage>{errors.phone}</FormErrorMessage>
                        </FormControl>
                      </Stack>

                      {/* Fila 5: Email (completo) */}
                      <FormControl isInvalid={submitCount > 0 && touched.email && !!errors.email}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMail} boxSize="1rem" />
                            <Text>Email</Text>
                            <Text fontSize="sm" color="gray.500">
                              (opcional)
                            </Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="email"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                        />
                        <FormErrorMessage>{errors.email}</FormErrorMessage>
                      </FormControl>

                      {/* Ubicación */}
                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMap} boxSize="1rem" />
                            <Text>Ubicación</Text>
                            <Text fontSize="sm" color="gray.500">
                              (opcional)
                            </Text>
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
                            <Icon as={FiCreditCard} boxSize="1rem" />
                            <Text>Cuentas bancarias</Text>
                            <Text fontSize="sm" color="gray.500">
                              (opcional)
                            </Text>
                          </HStack>
                        </FormLabel>
                        <FieldArray name="bankAccounts">
                          {({ push, remove, form }) => (
                            <VStack spacing="0.75rem" align="stretch">
                              {form.values.bankAccounts.map((_account: BankAccount, index: number) => (
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
                                        border="1px solid"
                                        borderColor={inputBorder}
                                        h="2.5rem"
                                        size="sm"
                                        borderRadius="md"
                                        required
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Banco</FormLabel>
                                      <Field
                                        as={Select}
                                        name={`bankAccounts.${index}.bank`}
                                        bg={inputBg}
                                        border="1px solid"
                                        borderColor={inputBorder}
                                        h="2.5rem"
                                        size="sm"
                                        borderRadius="md"
                                        required
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
                                        border="1px solid"
                                        borderColor={inputBorder}
                                        h="2.5rem"
                                        size="sm"
                                        borderRadius="md"
                                        required
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
                              >
                                Agregar cuenta bancaria
                              </Button>
                            </VStack>
                          )}
                        </FieldArray>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Observaciones</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="observations"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          rows={4}
                        />
                        <FormErrorMessage>{errors.observations}</FormErrorMessage>
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
                form="supplier-edit-form"
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
