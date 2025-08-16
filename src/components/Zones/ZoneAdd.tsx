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
  Checkbox,
  SimpleGrid,
  Box,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiMapPin, FiFileText, FiCalendar } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Zone } from '@/entities/zone';
import { useAddZone } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Day, getDayLabel } from '@/enums/day.enum';
import { ZoneImageUpload } from './ZoneImageUpload';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ZoneFormValues = {
  name: string;
  description: string;
  requestDays: Day[];
  deliveryDays: Day[];
};

const allDays = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY];

type ZoneAddProps = {
  isLoading: boolean;
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
};

type ZoneAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const ZoneAddModal = ({ isOpen, onClose, setZones }: ZoneAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.600', 'green.200');

  const [step, setStep] = useState<'form' | 'image'>('form');
  const [createdZone, setCreatedZone] = useState<Zone | null>(null);
  const [zoneProps, setZoneProps] = useState<Partial<Zone>>();
  const [hasImage, setHasImage] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);

  const { data, isLoading, error, fieldError } = useAddZone(zoneProps);

  const handleClose = () => {
    setStep('form');
    setCreatedZone(null);
    setZoneProps(undefined);
    setHasImage(false);
    setShowConfirmDialog(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    // Only show confirmation dialog if we're in form step and have unsaved changes
    if (step === 'form' && formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (data) {
      toast({
        title: 'Zona creada',
        description: `La zona "${data.name}" ha sido creada correctamente.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      setCreatedZone(data);
      setZoneProps(undefined);
      setZones((prev) => [...prev, data]);
      setStep('image');
    }
  }, [data, setZones, toast]);

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

  useEffect(() => {
    if (createdZone?.imageUrl) {
      setHasImage(true);
    }
  }, [createdZone?.imageUrl]);

  const handleSubmit = (values: ZoneFormValues) => {
    setZoneProps(values);
  };

  const handleImageChange = (newImageUrl: string | null) => {
    if (createdZone) {
      setZones((prevZones) => prevZones.map((z) => (z.id === createdZone.id ? { ...z, imageUrl: newImageUrl } : z)));
      setCreatedZone((prev) => (prev ? { ...prev, imageUrl: newImageUrl } : null));
    }
  };

  const handleSkipImage = () => {
    toast({
      title: 'Zona creada sin imagen',
      description: 'Puedes agregar una imagen más tarde editando la zona.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
    handleClose();
  };

  const handleFinishWithImage = () => {
    toast({
      title: '¡Perfecto!',
      description: 'Zona creada con imagen correctamente.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
    handleClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'lg' }}
        isCentered
        closeOnOverlayClick={step === 'image'}
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
            {step === 'form' ? 'Nueva zona' : 'Zona creada'}
          </ModalHeader>
          <ModalCloseButton />

          {step === 'form' ? (
            <>
              <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
                <Formik<ZoneFormValues>
                  initialValues={{
                    name: '',
                    description: '',
                    requestDays: [],
                    deliveryDays: [],
                  }}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ handleSubmit, values, dirty, resetForm }) => {
                    // Actualizar la instancia de formik solo cuando cambie
                    useEffect(() => {
                      setFormikInstance({ dirty, resetForm });
                    }, [dirty, resetForm]);

                    return (
                      <form id="zone-add-form" onSubmit={handleSubmit}>
                        <VStack spacing="1rem" align="stretch">
                          <Field name="name" validate={validate}>
                            {({ field, meta }: any) => (
                              <FormControl isInvalid={meta.error && meta.touched}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiMapPin} boxSize="1rem" />
                                    <Text>Nombre</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  {...field}
                                  placeholder="Ingrese el nombre de la zona"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  disabled={isLoading}
                                />
                                <FormErrorMessage>{meta.error}</FormErrorMessage>
                              </FormControl>
                            )}
                          </Field>

                          <Field name="description" validate={validateEmpty}>
                            {({ field, meta }: any) => (
                              <FormControl isInvalid={meta.error && meta.touched}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiFileText} boxSize="1rem" />
                                    <Text>Descripción</Text>
                                  </HStack>
                                </FormLabel>
                                <Textarea
                                  {...field}
                                  placeholder="Ingrese una descripción de la zona"
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

                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="1rem" w="100%">
                            <Box>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiCalendar} boxSize="1rem" />
                                  <Text>Días de pedidos</Text>
                                </HStack>
                              </FormLabel>
                              <FieldArray name="requestDays">
                                {({ push, remove }) =>
                                  allDays.map((day) => {
                                    const isChecked = values.requestDays.includes(day);
                                    return (
                                      <Checkbox
                                        key={`pedido-${day}`}
                                        isChecked={isChecked}
                                        onChange={(e) =>
                                          e.target.checked ? push(day) : remove(values.requestDays.indexOf(day))
                                        }
                                        mb="0.5rem"
                                        w="100%"
                                        disabled={isLoading}
                                      >
                                        {getDayLabel(day)}
                                      </Checkbox>
                                    );
                                  })
                                }
                              </FieldArray>
                            </Box>

                            <Box>
                              <FormLabel fontWeight="semibold">
                                <HStack spacing="0.5rem">
                                  <Icon as={FiCalendar} boxSize="1rem" />
                                  <Text>Días de entrega</Text>
                                </HStack>
                              </FormLabel>
                              <FieldArray name="deliveryDays">
                                {({ push, remove }) =>
                                  allDays.map((day) => {
                                    const isChecked = values.deliveryDays.includes(day);
                                    return (
                                      <Checkbox
                                        key={`entrega-${day}`}
                                        isChecked={isChecked}
                                        onChange={(e) =>
                                          e.target.checked ? push(day) : remove(values.deliveryDays.indexOf(day))
                                        }
                                        mb="0.5rem"
                                        w="100%"
                                        disabled={isLoading}
                                      >
                                        {getDayLabel(day)}
                                      </Checkbox>
                                    );
                                  })
                                }
                              </FieldArray>
                            </Box>
                          </SimpleGrid>
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
                    form="zone-add-form"
                    type="submit"
                    colorScheme="blue"
                    variant="outline"
                    isLoading={isLoading}
                    loadingText="Creando..."
                    leftIcon={<FaCheck />}
                    size="sm"
                  >
                    Crear zona
                  </Button>
                </HStack>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
                <VStack spacing="1rem">
                  <Box w="100%" p="1rem" bg={successBg} borderRadius="md" textAlign="center">
                    <Text color={successColor} fontWeight="medium">
                      Zona creada exitosamente
                    </Text>
                    <Text fontSize="sm" color={successColor}>
                      {hasImage ? '¡Imagen agregada!' : '¿Quieres agregar una imagen ahora?'}
                    </Text>
                  </Box>

                  {createdZone && (
                    <ZoneImageUpload zone={createdZone} onImageChange={handleImageChange} editable={!hasImage} />
                  )}
                </VStack>
              </ModalBody>

              <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
                <VStack w="100%" spacing="0.75rem">
                  {hasImage ? (
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      width="100%"
                      leftIcon={<FaCheck />}
                      onClick={handleFinishWithImage}
                      size="sm"
                    >
                      Finalizar
                    </Button>
                  ) : (
                    <Button variant="ghost" width="100%" onClick={handleSkipImage} size="sm">
                      Omitir imagen por ahora
                    </Button>
                  )}
                </VStack>
              </ModalFooter>
            </>
          )}
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
export const ZoneAdd = ({ isLoading: isLoadingZones, setZones }: ZoneAddProps) => {
  const canCreateZones = useUserStore((s) => s.hasPermission(Permission.CREATE_ZONES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateZones) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingZones}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <ZoneAddModal isOpen={isOpen} onClose={onClose} setZones={setZones} />}
    </>
  );
};
