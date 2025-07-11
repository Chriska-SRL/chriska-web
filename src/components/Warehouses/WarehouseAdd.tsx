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
  useToast,
  VStack,
  Progress,
  Box,
  Textarea,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Warehouse } from '@/entities/warehouse';
import { validate } from '@/utils/validations/validate';
import { useAddWarehouse } from '@/hooks/warehouse';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type WarehouseAddProps = {
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const WarehouseAdd = ({ setWarehouses }: WarehouseAddProps) => {
  const canCreateWarehouses = useUserStore((s) => s.hasPermission(Permission.CREATE_WAREHOUSES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [warehouseProps, setWarehouseProps] = useState<Partial<Warehouse>>();
  const { data, isLoading, error, fieldError } = useAddWarehouse(warehouseProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Depósito creado',
        description: `El depósito se creó correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setWarehouses((prev) => [...prev, data]);
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

  const handleSubmit = (values: { name: string; description: string; address: string }) => {
    setWarehouseProps({
      name: values.name,
      description: values.description,
      address: values.address,
    });
  };

  return (
    <>
      {canCreateWarehouses && (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          w={{ base: '100%', md: 'auto' }}
          px="1.5rem"
        >
          Agregar depósito
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo depósito
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ name: '', description: '', address: '' }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => {
              const showError = (field: keyof typeof errors) => submitCount > 0 && touched[field] && !!errors[field];

              return (
                <form onSubmit={handleSubmit}>
                  <ModalBody pb="0">
                    <VStack spacing="0.75rem">
                      <FormControl isInvalid={showError('name')}>
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

                      <FormControl isInvalid={showError('description')}>
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

                      <FormControl isInvalid={showError('address')}>
                        <FormLabel>Dirección</FormLabel>
                        <Field
                          as={Input}
                          name="address"
                          type="text"
                          bg={inputBg}
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validate}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.address}</FormErrorMessage>
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
              );
            }}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
