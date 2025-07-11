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
  Text,
  Checkbox,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { Zone } from '@/entities/zone';
import { Formik, Field, FieldArray } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useUpdateZone } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';

type ZoneEditProps = {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone | null;
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
};

const allDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export const ZoneEdit = ({ isOpen, onClose, zone, setZones }: ZoneEditProps) => {
  const toast = useToast();

  const [zoneProps, setZoneProps] = useState<Partial<Zone>>();
  const { data, isLoading, error, fieldError } = useUpdateZone(zoneProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Zona actualizada',
        description: 'La zona ha sido actualizada correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setZones((prevZones) => prevZones.map((z) => (z.id === data.id ? { ...z, ...data } : z)));
      setZoneProps(undefined);
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

  const handleSubmit = (values: Zone) => {
    setZoneProps(values);
  };

  const imagenUrl = 'https://developers.google.com/static/maps/images/landing/hero_geocoding_api.png';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0">
          Editar zona
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: zone?.id ?? 0,
            name: zone?.name ?? '',
            description: zone?.description ?? '',
            requestDays: zone?.requestDays ?? ['Martes', 'Jueves'],
            deliveryDays: zone?.deliveryDays ?? ['Miércoles', 'Jueves', 'Viernes'],
            zoneImage: zone?.zoneImage ?? '',
          }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount, values }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody
                pb="0"
                maxH="31rem"
                overflow="auto"
                sx={{
                  '&::-webkit-scrollbar': { display: 'none' },
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
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

                  <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                    <FormLabel>Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      name="description"
                      bg={inputBg}
                      borderColor={borderColor}
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>

                  {/* Checkboxes clickeables */}
                  <SimpleGrid columns={2} spacingX="2rem" alignItems="flex-start" w="100%">
                    <Box>
                      <Text mb="0.5rem">Días de pedidos</Text>
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
                                {day}
                              </Checkbox>
                            );
                          })
                        }
                      </FieldArray>
                    </Box>

                    <Box>
                      <Text mb="0.5rem">Días de entrega</Text>
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
                                {day}
                              </Checkbox>
                            );
                          })
                        }
                      </FieldArray>
                    </Box>
                  </SimpleGrid>

                  {/* Imagen */}
                  <Box w="100%">
                    <Text mb="0.5rem">Imagen de la zona</Text>
                    <Box border="1px solid" borderColor={borderColor} borderRadius="md" overflow="hidden" width="100%">
                      <Image src={imagenUrl} alt="Imagen de la zona" width="100%" objectFit="cover" />
                    </Box>
                  </Box>
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
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
