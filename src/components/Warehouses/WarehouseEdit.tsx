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
import { Warehouse } from '@/entities/warehouse';
import { validate } from '@/utils/validations/validate';
import { useUpdateWarehouse } from '@/hooks/warehouse';
import { validateEmpty } from '@/utils/validations/validateEmpty';

type WarehouseEditProps = {
  isOpen: boolean;
  onClose: () => void;
  warehouse: Warehouse;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const WarehouseEdit = ({ isOpen, onClose, warehouse, setWarehouses }: WarehouseEditProps) => {
  const toast = useToast();
  const [warehouseProps, setWarehouseProps] = useState<Partial<Warehouse>>();
  const { data, isLoading, error, fieldError } = useUpdateWarehouse(warehouseProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Almacén actualizado',
        description: 'El almacén ha sido modificado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setWarehouses((prev) => prev.map((w) => (w.id === data.id ? data : w)));
      setWarehouseProps(undefined);
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

  const handleSubmit = (values: { id: number; name: string; description: string; address: string }) => {
    const updatedWarehouse = {
      id: values.id,
      name: values.name,
      description: values.description,
      address: values.address,
    };
    setWarehouseProps(updatedWarehouse);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0">
          Editar almacén
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: warehouse.id,
            name: warehouse.name,
            description: warehouse.description,
            address: warehouse.address,
          }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
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
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
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
                      borderColor={borderColor}
                      validate={validateEmpty}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
                    <FormLabel>Dirección</FormLabel>
                    <Field
                      as={Input}
                      name="address"
                      type="text"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                      disabled={isLoading}
                    />
                    <FormErrorMessage>{errors.address}</FormErrorMessage>
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
                  <Button
                    type="submit"
                    disabled={isLoading}
                    bg="#4C88D8"
                    color="white"
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
