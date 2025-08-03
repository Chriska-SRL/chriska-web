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
  Textarea,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Select,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Supplier } from '@/entities/supplier';
import { BankAccount } from '@/entities/bankAccount';
import { useAddSupplier } from '@/hooks/supplier';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { Bank, BankOptions } from '@/enums/bank.enum';
import { useUserStore } from '@/stores/useUserStore';

type SupplierAddProps = {
  isLoading: boolean;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
};

export const SupplierAdd = ({ isLoading: isLoadingSuppliers, setSuppliers }: SupplierAddProps) => {
  const canCreateSuppliers = useUserStore((s) => s.hasPermission(Permission.CREATE_SUPPLIERS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [supplierProps, setSupplierProps] = useState<Partial<Supplier>>();
  const { data, isLoading, error, fieldError } = useAddSupplier(supplierProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Proveedor creado',
        description: 'El proveedor ha sido creado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setSupplierProps(undefined);
      setSuppliers((prev) => [...prev, data]);
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
    setSupplierProps({
      ...values,
      bankAccounts: values.bankAccounts || [],
    });
  };

  return (
    <>
      {canCreateSuppliers && (
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
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo proveedor
          </ModalHeader>
          <ModalCloseButton />
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
            validate={(values) => {
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
            }}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0" maxH="70dvh" overflowY="auto">
                  <VStack spacing="0.75rem">
                    <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                      <FormLabel>Nombre</FormLabel>
                      <Field as={Input} name="name" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.rut && !!errors.rut}>
                      <FormLabel>RUT</FormLabel>
                      <Field as={Input} name="rut" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.rut}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.razonSocial && !!errors.razonSocial}>
                      <FormLabel>Razón Social</FormLabel>
                      <Field as={Input} name="razonSocial" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                      <FormLabel>Dirección</FormLabel>
                      <Field as={Input} name="address" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.address}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.mapsAddress && !!errors.mapsAddress}>
                      <FormLabel>Dirección Maps</FormLabel>
                      <Field as={Input} name="mapsAddress" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.mapsAddress}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.phone && !!errors.phone}>
                      <FormLabel>Teléfono</FormLabel>
                      <Field as={Input} name="phone" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.phone}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.contactName && !!errors.contactName}>
                      <FormLabel>Persona de contacto</FormLabel>
                      <Field as={Input} name="contactName" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.email && !!errors.email}>
                      <FormLabel>Email</FormLabel>
                      <Field as={Input} name="email" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Cuentas bancarias</FormLabel>
                      <FieldArray name="bankAccounts">
                        {({ push, remove, form }) => (
                          <VStack spacing="0.75rem" align="stretch">
                            {form.values.bankAccounts.map((account: BankAccount, index: number) => (
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
                                  <FormControl isRequired>
                                    <FormLabel fontSize="sm">Nombre de cuenta</FormLabel>
                                    <Field
                                      as={Input}
                                      name={`bankAccounts.${index}.accountName`}
                                      bg={inputBg}
                                      borderColor={inputBorder}
                                      h="2.5rem"
                                      size="sm"
                                      borderRadius="md"
                                      required
                                    />
                                  </FormControl>
                                  <FormControl isRequired>
                                    <FormLabel fontSize="sm">Banco</FormLabel>
                                    <Field
                                      as={Select}
                                      name={`bankAccounts.${index}.bank`}
                                      bg={inputBg}
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
                                  <FormControl isRequired>
                                    <FormLabel fontSize="sm">Número de cuenta</FormLabel>
                                    <Field
                                      as={Input}
                                      name={`bankAccounts.${index}.accountNumber`}
                                      bg={inputBg}
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
                      <FormLabel>Observaciones</FormLabel>
                      <Field as={Textarea} name="observations" bg={inputBg} borderColor={inputBorder} />
                      <FormErrorMessage>{errors.observations}</FormErrorMessage>
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
                      bg={submitBg}
                      color="white"
                      _hover={{ backgroundColor: submitHover }}
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
