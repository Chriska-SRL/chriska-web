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
  Progress,
  Box,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Supplier } from '@/entities/supplier';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useUpdateSupplier, useDeleteSupplier } from '@/hooks/supplier';
import { validate } from '@/utils/validations/validate';
import { GenericDelete } from '../shared/GenericDelete';

type SupplierEditProps = {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
};

export const SupplierEdit = ({ isOpen, onClose, supplier, setSuppliers }: SupplierEditProps) => {
  const toast = useToast();

  const [supplierProps, setSupplierProps] = useState<Partial<Supplier>>();
  const { data, isLoading, error, fieldError } = useUpdateSupplier(supplierProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

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

  const handleSubmit = (values: Supplier) => {
    setSupplierProps(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar proveedor
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: supplier?.id ?? 0,
            name: supplier?.name ?? '',
            rut: supplier?.rut ?? '',
            razonSocial: supplier?.razonSocial ?? '',
            address: supplier?.address ?? '',
            mapsAddress: supplier?.mapsAddress ?? '',
            phone: supplier?.phone ?? '',
            contactName: supplier?.contactName ?? '',
            email: supplier?.email ?? '',
            bank: supplier?.bank ?? '',
            bankAccount: supplier?.bankAccount ?? '',
            observations: supplier?.observations ?? '',
          }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0" maxH="70vh" overflowY="auto">
                <VStack spacing="0.75rem">
                  <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                    <FormLabel>Nombre</FormLabel>
                    <Field
                      as={Input}
                      name="name"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.rut && !!errors.rut}>
                    <FormLabel>RUT</FormLabel>
                    <Field
                      as={Input}
                      name="rut"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.rut}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.razonSocial && !!errors.razonSocial}>
                    <FormLabel>Razón Social</FormLabel>
                    <Field as={Input} name="razonSocial" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                    <FormLabel>Dirección</FormLabel>
                    <Field as={Input} name="address" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.mapsAddress && !!errors.mapsAddress}>
                    <FormLabel>Dirección Maps</FormLabel>
                    <Field as={Input} name="mapsAddress" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.mapsAddress}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.phone && !!errors.phone}>
                    <FormLabel>Teléfono</FormLabel>
                    <Field as={Input} name="phone" bg={inputBg} borderColor={borderColor} h="2.75rem" />

                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.contactName && !!errors.contactName}>
                    <FormLabel>Persona de contacto</FormLabel>
                    <Field as={Input} name="contactName" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.email && !!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Field as={Input} name="email" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.bank && !!errors.bank}>
                    <FormLabel>Banco</FormLabel>
                    <Field as={Input} name="bank" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.bank}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.bankAccount && !!errors.bankAccount}>
                    <FormLabel>Cuenta bancaria</FormLabel>
                    <Field as={Input} name="bankAccount" bg={inputBg} borderColor={borderColor} h="2.75rem" />
                    <FormErrorMessage>{errors.bankAccount}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                    <FormLabel>Observaciones</FormLabel>
                    <Field as={Textarea} name="observations" bg={inputBg} borderColor={borderColor} />
                    <FormErrorMessage>{errors.observations}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter pb="1.5rem">
                <Box mt="0.25rem" w="100%">
                  <Progress
                    h={isLoading ? '4px' : '1px'}
                    mb="1.25rem"
                    size="xs"
                    isIndeterminate={isLoading}
                    colorScheme="blue"
                  />
                  <Box display="flex" gap="0.75rem">
                    {supplier && (
                      <GenericDelete
                        item={{ id: supplier.id, name: supplier.name }}
                        isUpdating={isLoading}
                        setItems={setSuppliers}
                        useDeleteHook={useDeleteSupplier}
                        onDeleted={onClose}
                      />
                    )}
                    <Button
                      type="submit"
                      bg="#4C88D8"
                      color="white"
                      disabled={isLoading}
                      _hover={{ backgroundColor: '#376bb0' }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      fontSize="1rem"
                    >
                      Guardar cambios
                    </Button>
                  </Box>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
