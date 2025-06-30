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
} from '@chakra-ui/react';
import { Zone } from '@/entities/zone';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useUpdateZone, useDeleteZone } from '@/hooks/zone';
import { validate } from '@/utils/validations/validate';
import { GenericDelete } from '../shared/GenericDelete';

type ZoneEditProps = {
  isOpen: boolean;
  onClose: () => void;
  zone: Zone | null;
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
};

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar zona
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: zone?.id ?? 0,
            name: zone?.name ?? '',
            description: zone?.description ?? '',
          }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0">
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
                    {zone && (
                      <GenericDelete
                        item={{ id: zone.id, name: zone.name }}
                        isUpdating={isLoading}
                        setItems={setZones}
                        useDeleteHook={useDeleteZone}
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
