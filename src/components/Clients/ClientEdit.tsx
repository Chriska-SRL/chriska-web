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
  Box,
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Textarea,
  Text,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import { Client } from '@/entities/client';
import { BankAccount } from '@/entities/bankAccount';
import { Formik, Field, FieldArray } from 'formik';
import { FaCheck, FaPlus, FaTrash } from 'react-icons/fa';
import {
  FiUser,
  FiMapPin,
  FiClock,
  FiPhone,
  FiMail,
  FiFileText,
  FiStar,
  FiMap,
  FiGrid,
  FiBox,
  FiHash,
  FiUsers,
} from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useGetZones } from '@/hooks/zone';
import { useUpdateClient } from '@/hooks/client';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { QualificationSelector } from '@/components/QualificationSelector';
import { BankOptions } from '@/enums/bank.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';
import { LocationPickerModal } from '@/components/LocationPickerModal';

type ClientEditProps = {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const ClientEditForm = ({
  isOpen,
  onClose,
  client,
  setClients,
}: {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
}) => {
  const toast = useToast();
  const { data: zones, isLoading: isLoadingZones } = useGetZones();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useUpdateClient();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(client.bankAccounts || []);

  // Modal para selección de ubicación
  const { isOpen: isLocationModalOpen, onOpen: openLocationModal, onClose: closeLocationModal } = useDisclosure();
  const [locationHandler, setLocationHandler] = useState<((lat: number, lng: number) => void) | null>(null);
  const [currentCoords, setCurrentCoords] = useState({
    lat: client.location?.latitude || -34.9011,
    lng: client.location?.longitude || -56.1645,
  });

  const handleClose = () => {
    setShowConfirmDialog(false);
    setBankAccounts(client.bankAccounts || []);
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
        title: 'Cliente actualizado',
        description: 'El cliente ha sido actualizado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setClients((prevClients) => prevClients.map((c) => (c.id === data.id ? { ...c, ...data } : c)));
      handleClose();
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

  const handleSubmit = async (values: any) => {
    const updatedClient = {
      ...values,
      location: {
        latitude: Number(values.latitude) || 0,
        longitude: Number(values.longitude) || 0,
      },
      zoneId: values.zoneId ? Number(values.zoneId) : null,
      bankAccounts: bankAccounts,
    };
    // Remove individual latitude/longitude from the object
    delete updatedClient.latitude;
    delete updatedClient.longitude;
    await mutate(updatedClient);
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
            Editar cliente
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                id: client.id,
                name: client.name,
                rut: client.rut,
                razonSocial: client.razonSocial || '',
                address: client.address,
                latitude: client.location?.latitude || 0,
                longitude: client.location?.longitude || 0,
                schedule: client.schedule,
                phone: client.phone,
                contactName: client.contactName,
                email: client.email || '',
                observations: client.observations || '',
                qualification: client.qualification,
                loanedCrates: client.loanedCrates,
                zoneId: client.zone?.id ? String(client.zone.id) : '',
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

                const handleLocationConfirm = (lat: number, lng: number) => {
                  setFieldValue('latitude', lat);
                  setFieldValue('longitude', lng);
                  setCurrentCoords({ lat, lng });
                };

                // Actualizar handler para el modal
                useEffect(() => {
                  setLocationHandler(() => handleLocationConfirm);
                }, [setFieldValue]);

                // Actualizar coordenadas actuales cuando cambian los valores del formulario
                useEffect(() => {
                  if (values.latitude && values.longitude) {
                    setCurrentCoords({ lat: Number(values.latitude), lng: Number(values.longitude) });
                  }
                }, [values.latitude, values.longitude]);

                return (
                  <form id="client-edit-form" onSubmit={handleSubmit}>
                    <Box>
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

                          <Field name="rut">
                            {({ field }: any) => (
                              <FormControl isInvalid={submitCount > 0 && touched.rut && !!errors.rut}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiHash} boxSize="1rem" />
                                    <Text>RUT (opcional)</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  {...field}
                                  placeholder="Ingrese el RUT del cliente"
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
                          <Field name="razonSocial">
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

                          <Field name="zoneId" validate={validateEmpty}>
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
                        <Field name="address" validate={validateEmpty}>
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
                                placeholder="Ingrese la dirección del cliente"
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
                                  placeholder="Ingrese el teléfono del cliente"
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
                                  <Text>Correo electrónico (opcional)</Text>
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

                        {/* Fila 6: Ubicación */}
                        <FormControl>
                          <FormLabel fontWeight="semibold">
                            <HStack spacing="0.5rem">
                              <Icon as={FiMap} boxSize="1rem" />
                              <Text>Ubicación</Text>
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
                                onClick={openLocationModal}
                                disabled={isLoading}
                                colorScheme="blue"
                                variant="outline"
                              >
                                Seleccionar en mapa
                              </Button>
                            </HStack>
                          </VStack>
                        </FormControl>

                        {/* Fila 7: Horario (completo) */}
                        <Field name="schedule" validate={validateEmpty}>
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
                          <Field name="loanedCrates" validate={validateEmpty}>
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
                                  placeholder="0"
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
                            <FormLabel fontWeight="semibold">
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
                              <Icon as={FiGrid} boxSize="1rem" />
                              <Text>Cuentas bancarias (opcional)</Text>
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
                                          h="2.5rem"
                                          size="sm"
                                          borderRadius="md"
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
                                          h="2.5rem"
                                          size="sm"
                                          borderRadius="md"
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
                                          h="2.5rem"
                                          size="sm"
                                          borderRadius="md"
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
                                rows={3}
                                resize="vertical"
                                disabled={isLoading}
                              />
                              <FormErrorMessage>{errors.observations}</FormErrorMessage>
                            </FormControl>
                          )}
                        </Field>
                      </VStack>
                    </Box>
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
                form="client-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Actualizando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Actualizar cliente
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

// Componente principal que controla cuándo renderizar el formulario
export const ClientEdit = ({ isOpen, onClose, client, setClients }: ClientEditProps) => {
  // Solo renderizar el formulario cuando el modal está abierto y hay client
  if (!isOpen || !client) return null;

  return <ClientEditForm isOpen={isOpen} onClose={onClose} client={client} setClients={setClients} />;
};
