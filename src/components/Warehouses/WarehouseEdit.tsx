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
  Flex,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  IconButton,
  Textarea,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Warehouse } from '@/entities/warehouse';
import { validate } from '@/utils/validations/validate';
import { useUpdateWarehouse, useDeleteWarehouse } from '@/hooks/warehouse';
import { GenericDelete } from '../shared/GenericDelete';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type WarehouseEditProps = {
  warehouse: Warehouse;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const WarehouseEdit = ({ warehouse, setWarehouses }: WarehouseEditProps) => {
  const canEditWarehouses = useUserStore((s) => s.hasPermission(Permission.EDIT_WAREHOUSES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [warehouseProps, setWarehouseProps] = useState<Partial<Warehouse>>();
  const { data, isLoading, error, fieldError } = useUpdateWarehouse(warehouseProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const hoverBg = useColorModeValue('#e0dede', 'gray.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Depósito actualizado',
        description: 'El depósito se modificó correctamente.',
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
    setWarehouseProps({
      id: values.id,
      name: values.name,
      description: values.description,
      address: values.address,
    });
  };

  return (
    <>
      <IconButton
        aria-label="Editar depósito"
        icon={<FiEdit />}
        onClick={onOpen}
        size="md"
        bg="transparent"
        _hover={{ bg: hoverBg }}
        disabled={!canEditWarehouses}
      />

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Editar depósito
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

                    <FormControl isInvalid={submitCount > 0 && touched.address && !!errors.address}>
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
                    <Flex gap="1rem" align={{ base: 'stretch', md: 'center' }} w="100%">
                      <GenericDelete
                        item={{ id: warehouse.id, name: warehouse.name }}
                        isUpdating={isLoading}
                        setItems={setWarehouses}
                        useDeleteHook={useDeleteWarehouse}
                        onDeleted={onClose}
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
                    </Flex>
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
