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
  Textarea,
  useToast,
  VStack,
  Progress,
  Box,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Text,
  Checkbox,
  SimpleGrid,
  Image,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Zone } from '@/entities/zone';
import { useAddZone } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { PermissionId } from '@/entities/permissions/permissionId';
import { useUserStore } from '@/stores/useUserStore';

type ZoneFormValues = {
  name: string;
  description: string;
  requestDays: string[];
  deliveryDays: string[];
  zoneImage: string;
};

const allDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

type ZoneAddProps = {
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
};

export const ZoneAdd = ({ setZones }: ZoneAddProps) => {
  const canCreateZones = useUserStore((s) => s.hasPermission(PermissionId.CREATE_ZONES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [zoneProps, setZoneProps] = useState<Partial<Zone>>();
  const { data, isLoading, error, fieldError } = useAddZone(zoneProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Zona creada',
        description: `La zona ha sido creada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setZoneProps(undefined);
      setZones((prev) => [...prev, data]);
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

  const handleSubmit = (values: Partial<Zone>) => {
    setZoneProps(values);
  };

  const imagenUrl = 'https://developers.google.com/static/maps/images/landing/hero_geocoding_api.png';

  return (
    <>
      {canCreateZones && (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          w={{ base: '100%', md: 'auto' }}
          px="1.5rem"
        >
          Agregar zona
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nueva zona
          </ModalHeader>
          <ModalCloseButton />
          <Formik<ZoneFormValues>
            initialValues={{
              name: '',
              description: '',
              requestDays: [],
              deliveryDays: [],
              zoneImage: '',
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        validate={validate}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>

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

                    <Box w="100%">
                      <Text mb="0.5rem">Imagen de la zona</Text>
                      <Box
                        border="1px solid"
                        borderColor={inputBorder}
                        borderRadius="md"
                        overflow="hidden"
                        width="100%"
                      >
                        <Image src={imagenUrl} alt="Imagen de la zona" width="100%" objectFit="cover" />
                      </Box>
                    </Box>
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
