'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Progress,
  Box,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  Textarea,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Shelve } from '@/entities/shelve';
import { validate } from '@/utils/validations/validate';
import { useUpdateShelve } from '@/hooks/shelve';
import { Warehouse } from '@/entities/warehouse';

type ShelveEditProps = {
  isOpen: boolean;
  onClose: () => void;
  shelve: Shelve;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const ShelveEdit = ({ isOpen, onClose, shelve, setWarehouses }: ShelveEditProps) => {
  const toast = useToast();
  const [shelveProps, setShelveProps] = useState<Partial<Shelve>>();
  const { data, isLoading, error, fieldError } = useUpdateShelve(shelveProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Estantería actualizada',
        description: 'La estantería se modificó correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });

      setWarehouses((prev) =>
        prev.map((w) => {
          if (w.id === shelve.warehouse.id) {
            return {
              ...w,
              shelves: w.shelves.map((s) => (s.id === data.id ? data : s)),
            };
          }
          return w;
        }),
      );
      setShelveProps(undefined);
      onClose();
    }
  }, [data]);

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
  }, [error, fieldError]);

  const handleSubmit = (values: { id: number; name: string; description: string }) => {
    const newShelve = {
      id: values.id,
      name: values.name,
      description: values.description,
      warehouseId: shelve.warehouse.id,
    };
    setShelveProps(newShelve);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Editar estantería
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              id: shelve.id,
              name: shelve.name,
              description: shelve.description,
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
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={validate}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                      <FormLabel>Descripción</FormLabel>
                      <Field
                        as={Textarea}
                        name="description"
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="5rem"
                        validate={validate}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
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
                      bg="#4C88D8"
                      color="white"
                      _hover={{ backgroundColor: '#376bb0' }}
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
