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
  useToast,
  useColorModeValue,
  FormErrorMessage,
  Text,
  Checkbox,
  SimpleGrid,
  HStack,
  Icon,
  Box,
} from '@chakra-ui/react';
import { Zone } from '@/entities/zone';
import { ZoneImageUpload } from './ZoneImageUpload';
import { Formik, Field, FieldArray } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiMapPin, FiFileText, FiCalendar, FiClock } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useUpdateZone } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { Day, getDayLabel } from '@/enums/day.enum';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type ZoneEditProps = {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone | null;
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
};

const allDays = [Day.MONDAY, Day.TUESDAY, Day.WEDNESDAY, Day.THURSDAY, Day.FRIDAY, Day.SATURDAY, Day.SUNDAY];

// Mapeo para convertir días en español a inglés
const spanishToEnglishDayMap: Record<string, Day> = {
  Lunes: Day.MONDAY,
  Martes: Day.TUESDAY,
  Miércoles: Day.WEDNESDAY,
  Jueves: Day.THURSDAY,
  Viernes: Day.FRIDAY,
  Sábado: Day.SATURDAY,
  Domingo: Day.SUNDAY,
};

const convertDaysToEnglish = (days: string[]): Day[] => {
  return days
    .map((day) => {
      // Si ya está en inglés, lo devolvemos tal como está
      if (Object.values(Day).includes(day as Day)) {
        return day as Day;
      }
      // Si está en español, lo convertimos
      return spanishToEnglishDayMap[day] || (day as Day);
    })
    .filter((day) => Object.values(Day).includes(day)); // Filtrar valores válidos
};

export const ZoneEdit = ({ isOpen, onClose, zone, setZones }: ZoneEditProps) => {
  const toast = useToast();

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useUpdateZone();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (zone?.imageUrl) {
      setCurrentImageUrl(zone.imageUrl);
    }
  }, [zone?.imageUrl]);

  useEffect(() => {
    if (data) {
      toast({
        title: 'Zona actualizada',
        description: 'La zona ha sido actualizada correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setZones((prevZones) =>
        prevZones.map((z) => (z.id === data.id ? { ...z, ...data, imageUrl: currentImageUrl || null } : z)),
      );
      onClose();
    }
  }, [data, currentImageUrl]);

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

  const handleSubmit = async (values: Zone) => {
    await mutate(values);
  };

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

  const handleImageChange = (newImageUrl: string | null) => {
    setCurrentImageUrl(newImageUrl);

    if (zone) {
      setZones((prevZones) => prevZones.map((z) => (z.id === zone.id ? { ...z, imageUrl: newImageUrl || null } : z)));
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'md' }}
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
            Editar zona
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                id: zone?.id ?? 0,
                name: zone?.name ?? '',
                description: zone?.description ?? '',
                requestDays: convertDaysToEnglish(zone?.requestDays ?? []),
                deliveryDays: convertDaysToEnglish(zone?.deliveryDays ?? []),
                imageUrl: zone?.imageUrl ?? null,
              }}
              onSubmit={handleSubmit}
              validateOnChange
              validateOnBlur={false}
            >
              {({ handleSubmit, errors, touched, submitCount, values, dirty, resetForm }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="zone-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="0.75rem">
                      {zone && (
                        <ZoneImageUpload
                          zone={{
                            ...zone,
                            imageUrl: currentImageUrl,
                          }}
                          onImageChange={handleImageChange}
                          editable
                        />
                      )}

                      <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiMapPin} boxSize="1rem" />
                            <Text>Nombre</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="name"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validate}
                        />
                        <FormErrorMessage>{errors.name}</FormErrorMessage>
                      </FormControl>

                      <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiFileText} boxSize="1rem" />
                            <Text>Descripción</Text>
                            <Text color="red.500">*</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Textarea}
                          name="description"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          validate={validate}
                          rows={4}
                        />
                        <FormErrorMessage>{errors.description}</FormErrorMessage>
                      </FormControl>

                      <SimpleGrid columns={2} spacingX="2rem" alignItems="flex-start" w="100%">
                        <Box>
                          <HStack mb="0.5rem" spacing="0.5rem">
                            <Icon as={FiCalendar} boxSize="1rem" />
                            <Text fontWeight="semibold">Días de pedidos</Text>
                          </HStack>
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
                                  >
                                    {getDayLabel(day)}
                                  </Checkbox>
                                );
                              })
                            }
                          </FieldArray>
                        </Box>

                        <Box>
                          <HStack mb="0.5rem" spacing="0.5rem">
                            <Icon as={FiClock} boxSize="1rem" />
                            <Text fontWeight="semibold">Días de entrega</Text>
                          </HStack>
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
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm" leftIcon={<FaTimes />}>
                Cancelar
              </Button>
              <Button
                form="zone-edit-form"
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

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};
