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
  Select,
  useToast,
  VStack,
  Progress,
  Box,
  Textarea,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Client } from '@/entities/client';
import { useAddClient } from '@/hooks/client';
import { useGetZones } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';

type ClientAddProps = {
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

export const ClientAdd = ({ setClients }: ClientAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [clientProps, setClientProps] = useState<Partial<Client>>();
  const { data, isLoading, error, fieldError } = useAddClient(clientProps);

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Cliente creado',
        description: `El cliente ha sido creado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setClientProps(undefined);
      setClients((prev) => [...prev, data]);
      onClose();
    }
  }, [data]);

  useEffect(() => {
    if (fieldError) {
      toast({ title: `Error`, description: fieldError.error, status: 'error', duration: 4000, isClosable: true });
    } else if (error) {
      toast({ title: 'Error inesperado', description: error, status: 'error', duration: 3000, isClosable: true });
    }
  }, [error, fieldError]);

  const handleSubmit = (values: Partial<Client> & { zoneId: number }) => {
    console.log('id', values.zoneId);
    const newClient = {
      ...values,
      zoneId: values.zoneId,
    };
    setClientProps(newClient);
  };

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        Agregar cliente
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo cliente
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              name: '',
              rut: '',
              razonSocial: '',
              address: '',
              mapsAddress: '',
              schedule: '',
              phone: '',
              contactName: '',
              email: '',
              observations: '',
              bank: '',
              bankAccount: '',
              loanedCrates: 0,
              zoneId: 0,
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        h="2.75rem"
                        // validate={validate}
                      />
                      <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                      <FormLabel>Dirección</FormLabel>
                      <Field
                        as={Input}
                        name="address"
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        h="2.75rem"
                        // validate={validate}
                      />
                      <FormErrorMessage>{errors.mapsAddress}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.schedule && !!errors.schedule}>
                      <FormLabel>Horario</FormLabel>
                      <Field
                        as={Input}
                        name="schedule"
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        h="2.75rem"
                        // validate={validate}
                      />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                      <FormLabel>Observaciones</FormLabel>
                      <Field
                        as={Textarea}
                        name="observations"
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        h="2.75rem"
                        fontSize="0.875rem"
                        validate={validate}
                        disabled={isLoadingZones}
                      >
                        {zones?.map((z) => (
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
