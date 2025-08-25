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
  Textarea,
  useToast,
  VStack,
  Box,
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck, FaTrash } from 'react-icons/fa';
import {
  FiUser,
  FiHash,
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiFileText,
  FiStar,
  FiBox,
  FiCreditCard,
  FiUsers,
  FiMap,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Client } from '@/entities/client';
import { BankAccount } from '@/entities/bankAccount';
import { useAddClient } from '@/hooks/client';
import { useGetZones } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { QualificationSelector } from '@/components/QualificationSelector';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { BankOptions } from '@/enums/bank.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ClientAddProps = {
  isLoading: boolean;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

type ClientAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const ClientAddModal = ({ isOpen, onClose, setClients }: ClientAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [clientProps, setClientProps] = useState<Partial<Client>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddClient(clientProps);

  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  // Estado para las bank accounts
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const handleClose = () => {
    setClientProps(undefined);
    setBankAccounts([]);
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
        title: 'Cliente creado',
        description: 'El cliente ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setClientProps(undefined);
      setBankAccounts([]);
      setClients((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setClients, toast, onClose]);

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
    const newClient = {
      ...values,
      location: {
        latitude: Number(values.latitude) || 0,
        longitude: Number(values.longitude) || 0,
      },
      zoneId: Number(values.zoneId),
      bankAccounts: bankAccounts,
    };
    // Remove individual latitude/longitude from the object
    delete newClient.latitude;
    delete newClient.longitude;
    setClientProps(newClient);
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
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Nuevo cliente
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                name: '',
                rut: '',
                razonSocial: '',
                address: '',
                latitude: 0,
                longitude: 0,
                schedule: '',
                phone: '',
                contactName: '',
                email: '',
                observations: '',
                qualification: '',
                loanedCrates: 0,
                zoneId: '',
              }}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, values, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="client-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      {/* Fila 1: Nombre - RUT */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem">
                        <Field name="name" validate={validate}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Nombre</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                placeholder="Ingrese el nombre del cliente"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.name}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="rut" validate={validate}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.rut && !!errors.rut}>
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
                              <FormErrorMessage>{errors.rut}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      {/* Fila 2: Razón Social - Zona */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem">
                        <Field name="razonSocial" validate={validateEmpty}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.razonSocial && !!errors.razonSocial}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUsers} boxSize="1rem" />
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
                              <FormErrorMessage>{errors.razonSocial}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="zoneId" validate={validate}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.zoneId && !!errors.zoneId}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiMapPin} boxSize="1rem" />
                                  <Text>Zona</Text>
                                </HStack>
                              </FormLabel>
                              <Select
                                {...field}
                                placeholder="Seleccionar zona"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoadingZones || isLoading}
                              >
                                {zones?.map((zone) => (
                                  <option key={zone.id} value={zone.id}>
                                    {zone.name}
                                  </option>
                                ))}
                              </Select>
                              <FormErrorMessage>{errors.zoneId}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      {/* Fila 3: Dirección (completo) */}
                      <Field name="address" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiMapPin} boxSize="1rem" />
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
                            <FormErrorMessage>{errors.address}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      {/* Fila 4: Persona de contacto - Teléfono */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem">
                        <Field name="contactName" validate={validate}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.contactName && !!errors.contactName}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiUser} boxSize="1rem" />
                                  <Text>Persona de contacto</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                placeholder="Ingrese la persona de contacto"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.contactName}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="phone" validate={validate}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.phone && !!errors.phone}>
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
                              <FormErrorMessage>{errors.phone}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      {/* Fila 5: Email (completo) */}
                      <Field name="email" validate={validateEmpty}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.email && !!errors.email}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiMail} boxSize="1rem" />
                                <Text>Correo electrónico</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Ingrese el correo electrónico"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.email}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      {/* Fila 6: Ubicación (Latitud - Longitud) */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem">
                        <Field name="latitude" validate={validateEmpty}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.latitude && !!errors.latitude}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiMap} boxSize="1rem" />
                                  <Text>Latitud</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                type="number"
                                step="any"
                                placeholder="Ingrese la latitud"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.latitude}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <Field name="longitude" validate={validateEmpty}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.longitude && !!errors.longitude}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiMap} boxSize="1rem" />
                                  <Text>Longitud</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                type="number"
                                step="any"
                                placeholder="Ingrese la longitud"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.longitude}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </SimpleGrid>

                      {/* Fila 7: Horario (completo) */}
                      <Field name="schedule" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.schedule && !!errors.schedule}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiClock} boxSize="1rem" />
                                <Text>Horario</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el horario de atención"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.schedule}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      {/* Fila 8: Cajones prestados - Calificación */}
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem">
                        <Field name="loanedCrates" validate={validate}>
                          {({ field }: any) => (
                            <FormControl isInvalid={submitCount > 0 && touched.loanedCrates && !!errors.loanedCrates}>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiBox} boxSize="1rem" />
                                  <Text>Cajones prestados</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                {...field}
                                type="number"
                                min="0"
                                placeholder="Ingrese la cantidad de cajones prestados"
                                bg={inputBg}
                                border="1px solid"
                                borderColor={inputBorder}
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.loanedCrates}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>

                        <FormControl>
                          <FormLabel fontWeight="semibold" mb="0.75rem">
                            <HStack spacing="0.5rem">
                              <Icon as={FiStar} boxSize="1rem" />
                              <Text>Calificación</Text>
                            </HStack>
                          </FormLabel>
                          <QualificationSelector
                            value={values.qualification}
                            onChange={(value) => setFieldValue('qualification', value)}
                            size="2.25rem"
                            spacing="0.75rem"
                          />
                        </FormControl>
                      </SimpleGrid>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiCreditCard} boxSize="1rem" />
                            <Text>Cuentas bancarias</Text>
                          </HStack>
                        </FormLabel>
                        <FieldArray name="bankAccounts">
                          {() => (
                            <VStack spacing="0.75rem" align="stretch">
                              {bankAccounts.map((account: BankAccount, index: number) => (
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
                                      <Input
                                        value={account.accountName}
                                        onChange={(e) => {
                                          const updatedAccounts = [...bankAccounts];
                                          updatedAccounts[index].accountName = e.target.value;
                                          setBankAccounts(updatedAccounts);
                                        }}
                                        bg={inputBg}
                                        borderColor={inputBorder}
                                        size="sm"
                                        disabled={isLoading}
                                      />
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Banco</FormLabel>
                                      <Select
                                        value={account.bank}
                                        onChange={(e) => {
                                          const updatedAccounts = [...bankAccounts];
                                          updatedAccounts[index].bank = e.target.value;
                                          setBankAccounts(updatedAccounts);
                                        }}
                                        bg={inputBg}
                                        borderColor={inputBorder}
                                        size="sm"
                                        disabled={isLoading}
                                      >
                                        <option value="">Seleccionar banco</option>
                                        {BankOptions.map((bank) => (
                                          <option key={bank} value={bank}>
                                            {bank}
                                          </option>
                                        ))}
                                      </Select>
                                    </FormControl>
                                    <FormControl>
                                      <FormLabel fontSize="sm">Número de cuenta</FormLabel>
                                      <Input
                                        value={account.accountNumber}
                                        onChange={(e) => {
                                          const updatedAccounts = [...bankAccounts];
                                          updatedAccounts[index].accountNumber = e.target.value;
                                          setBankAccounts(updatedAccounts);
                                        }}
                                        bg={inputBg}
                                        borderColor={inputBorder}
                                        size="sm"
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
                                    onClick={() => {
                                      const updatedAccounts = bankAccounts.filter((_, i) => i !== index);
                                      setBankAccounts(updatedAccounts);
                                    }}
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
                                onClick={() =>
                                  setBankAccounts([...bankAccounts, { accountName: '', bank: '', accountNumber: '' }])
                                }
                                variant="ghost"
                                disabled={isLoading}
                              >
                                Agregar cuenta bancaria
                              </Button>
                            </VStack>
                          )}
                        </FieldArray>
                      </FormControl>

                      <Field name="observations" validate={validateEmpty}>
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
                              placeholder="Ingrese observaciones sobre el cliente"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              rows={4}
                              resize="vertical"
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
                form="client-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear cliente
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
export const ClientAdd = ({ isLoading: isLoadingClients, setClients }: ClientAddProps) => {
  const canCreateClients = useUserStore((s) => s.hasPermission(Permission.CREATE_CLIENTS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateClients) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingClients}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <ClientAddModal isOpen={isOpen} onClose={onClose} setClients={setClients} />}
    </>
  );
};
