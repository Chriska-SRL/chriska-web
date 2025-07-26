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
import { BankAccount } from '@/entities/bankAccount';
import { useAddClient } from '@/hooks/client';
import { useGetZones } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { QualificationSelector } from '@/components/QualificationSelector';
import { BankAccountsManager } from '@/components/BankAccountsManager';

type ClientAddProps = {
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

export const ClientAdd = ({ setClients }: ClientAddProps) => {
  const canCreateClients = useUserStore((s) => s.hasPermission(Permission.CREATE_CLIENTS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [clientProps, setClientProps] = useState<Partial<Client>>();
  const { data, isLoading, error, fieldError } = useAddClient(clientProps);

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  // Estado para las bank accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

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
      setBankAccounts([]); // Limpiar bank accounts
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

  const handleSubmit = (values: any) => {
    const newClient = {
      ...values,
      zoneId: values.zoneId,
      bankAccounts: bankAccounts, // Incluir las bank accounts
    };
    setClientProps(newClient);
  };

  return (
    <>
      {canCreateClients && (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          px="1.5rem"
          disabled={!canCreateClients}
        >
          Nuevo
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
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
              qualification: '',
              loanedCrates: 0,
              zoneId: 0,
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount, values, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0" maxH="70dvh" overflowY="auto">
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
                      <Field as={Input} name="razonSocial" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
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
                      <Field as={Input} name="mapsAddress" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
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
                      <FormLabel>Correo electrónico</FormLabel>
                      <Field as={Input} name="email" type="email" bg={inputBg} borderColor={inputBorder} h="2.75rem" />
                      <FormErrorMessage>{errors.email}</FormErrorMessage>
                    </FormControl>

                    {/* Bank Accounts Manager */}
                    <BankAccountsManager bankAccounts={bankAccounts} onChange={setBankAccounts} />

                    <FormControl isInvalid={submitCount > 0 && touched.loanedCrates && !!errors.loanedCrates}>
                      <FormLabel>Cajones prestados</FormLabel>
                      <Field
                        as={Input}
                        name="loanedCrates"
                        type="number"
                        min="0"
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

                    <FormControl isInvalid={submitCount > 0 && touched.qualification && !!errors.qualification}>
                      <FormLabel>Calificación</FormLabel>
                      <QualificationSelector
                        value={values.qualification}
                        onChange={(value) => setFieldValue('qualification', value)}
                      />
                      <FormErrorMessage>{errors.qualification}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.observations && !!errors.observations}>
                      <FormLabel>Observaciones</FormLabel>
                      <Field
                        as={Textarea}
                        name="observations"
                        bg={inputBg}
                        borderColor={inputBorder}
                        rows={3}
                        resize="vertical"
                        validate={validate}
                      />
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
