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
  Select,
  VStack,
  Button,
  Progress,
  Box,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react';
import { Client } from '@/entities/client';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useGetZones } from '@/hooks/zone';
import { useUpdateClient, useDeleteClient } from '@/hooks/client';
import { validate } from '@/utils/validations/validate';
import { GenericDelete } from '../shared/GenericDelete';
import { Zone } from '@/entities/zone';

type ClientEditProps = {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

export const ClientEdit = ({ isOpen, onClose, client, setClients }: ClientEditProps) => {
  const toast = useToast();
  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const [clientProps, setClientProps] = useState<Partial<Client>>();
  const { data, isLoading, error, fieldError } = useUpdateClient(clientProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Cliente actualizado',
        description: 'El cliente ha sido actualizado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setClients((prevClients) => prevClients.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
      setClientProps(undefined);
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

  const handleSubmit = (values: Partial<Client> & { zoneId: number }) => {
    const updatedClient = {
      ...values,
      zoneId: values.zoneId,
    };
    setClientProps(updatedClient);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar cliente
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: client?.id ?? 0,
            name: client?.name ?? '',
            rut: client?.rut ?? '',
            razonSocial: client?.razonSocial ?? '',
            address: client?.address ?? '',
            mapsAddress: client?.mapsAddress ?? '',
            schedule: client?.schedule ?? '',
            phone: client?.phone ?? '',
            contactName: client?.contactName ?? '',
            email: client?.email ?? '',
            observations: client?.observations ?? '',
            bank: client?.bank ?? '',
            bankAccount: client?.bankAccount ?? '',
            loanedCrates: client?.loanedCrates ?? 0,
            zoneId: client?.zone?.id ?? 0,
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
                    <Field
                      as={Input}
                      name="razonSocial"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      //   validate={validate}
                    />
                    <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                    <FormLabel>Dirección</FormLabel>
                    <Field
                      as={Input}
                      name="address"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.mapsAddress && !!errors.mapsAddress}>
                    <FormLabel>Dirección en Maps</FormLabel>
                    <Field
                      as={Input}
                      name="mapsAddress"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      //   validate={validate}
                    />
                    <FormErrorMessage>{errors.mapsAddress}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.schedule && !!errors.schedule}>
                    <FormLabel>Horario</FormLabel>
                    <Field
                      as={Input}
                      name="schedule"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.schedule}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.phone && !!errors.phone}>
                    <FormLabel>Teléfono</FormLabel>
                    <Field
                      as={Input}
                      name="phone"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.contactName && !!errors.contactName}>
                    <FormLabel>Persona de contacto</FormLabel>
                    <Field
                      as={Input}
                      name="contactName"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.email && !!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Field
                      as={Input}
                      name="email"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      //   validate={validate}
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                    <FormLabel>Observaciones</FormLabel>
                    <Field
                      as={Textarea}
                      name="observations"
                      bg={inputBg}
                      borderColor={borderColor}
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.observations}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.bank && !!errors.bank}>
                    <FormLabel>Banco</FormLabel>
                    <Field
                      as={Input}
                      name="bank"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.bank}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.bankAccount && !!errors.bankAccount}>
                    <FormLabel>Cuenta bancaria</FormLabel>
                    <Field
                      as={Input}
                      name="bankAccount"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.bankAccount}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.loanedCrates && !!errors.loanedCrates}>
                    <FormLabel>Cajones prestados</FormLabel>
                    <Field
                      as={Input}
                      name="loanedCrates"
                      type="number"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.loanedCrates}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.zoneId && !!errors.zoneId}>
                    <FormLabel>Zona</FormLabel>
                    <Field
                      as={Select}
                      name="zoneId"
                      placeholder="Seleccionar zona"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                      disabled={isLoadingZones}
                    >
                      {zones?.map((z: Zone) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                    </Field>
                    <FormErrorMessage>{errors.zoneId}</FormErrorMessage>
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
                    {client && (
                      <GenericDelete
                        item={{ id: client.id, name: client.name }}
                        isUpdating={isLoading}
                        setItems={setClients}
                        useDeleteHook={useDeleteClient}
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
