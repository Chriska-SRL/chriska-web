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
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field, FieldArray } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Zone } from '@/entities/zone';
import { useAddZone } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { Day, getDayLabel } from '@/enums/day.enum';
import { ZoneImageUpload } from './ZoneImageUpload';

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

export const ZoneAdd = ({ isLoading: isLoadingZones, setZones }: ZoneAddProps) => {
  const canCreateZones = useUserStore((s) => s.hasPermission(Permission.CREATE_ZONES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [step, setStep] = useState<'form' | 'image'>('form');
  const [createdZone, setCreatedZone] = useState<Zone | null>(null);
  const [zoneProps, setZoneProps] = useState<Partial<Zone>>();

  const { data, isLoading, error, fieldError } = useAddZone(zoneProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');
  const successBg = useColorModeValue('green.50', 'green.900');
  const successColor = useColorModeValue('green.600', 'green.200');

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
  }, [error, fieldError, toast]);

  const handleSubmit = (values: ZoneFormValues) => {
    setZoneProps(values);
  };

  const handleImageChange = (newImageUrl: string | null) => {
    if (createdZone) {
      setZones((prevZones) => prevZones.map((z) => (z.id === createdZone.id ? { ...z, imageUrl: newImageUrl } : z)));
      setCreatedZone((prev) => (prev ? { ...prev, imageUrl: newImageUrl } : null));
    }
  };

  const handleClose = () => {
    setStep('form');
    setCreatedZone(null);
    setZoneProps(undefined);
    onClose();
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

  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (createdZone?.imageUrl) {
      setHasImage(true);
    }
  }, [createdZone?.imageUrl]);

  return (
    <>
      {canCreateZones && (
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
      )}

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'sm' }}
        isCentered
        closeOnOverlayClick={step === 'form'}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            {step === 'form' ? 'Nueva zona' : 'Zona creada'}
          </ModalHeader>
          <ModalCloseButton />

          {step === 'form' ? (
            <Formik<ZoneFormValues>
              initialValues={{
                name: '',
                description: '',
                requestDays: [],
                deliveryDays: [],
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
                                    {getDayLabel(day)}
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
                                    {getDayLabel(day)}
                                  </Checkbox>
                                );
                              })
                            }
                          </FieldArray>
                        </Box>
                      </SimpleGrid>
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
                        Crear zona
                      </Button>
                    </Box>
                  </ModalFooter>
                </form>
              )}
            </Formik>
          ) : (
            <>
              <ModalBody pb="0">
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

              <ModalFooter pb="1.5rem">
                <VStack w="100%" spacing="0.75rem">
                  {hasImage ? (
                    <Button
                      bg={submitBg}
                      color="white"
                      _hover={{ backgroundColor: submitHover }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      onClick={handleFinishWithImage}
                    >
                      Finalizar
                    </Button>
                  ) : (
                    <Button
                      variant="fill"
                      color="white"
                      _hover={{ backgroundColor: buttonHover }}
                      width="100%"
                      onClick={handleSkipImage}
                    >
                      Omitir imagen por ahora
                    </Button>
                  )}
                </VStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
