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
  IconButton,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Shelve } from '@/entities/shelve';
import { Warehouse } from '@/entities/warehouse';
import { validate } from '@/utils/validations/validate';
import { useAddShelve } from '@/hooks/shelve';
import { useUserStore } from '@/stores/useUserStore';
import { PermissionId } from '@/entities/permissions/permissionId';

type ShelveAddProps = {
  warehouse: Warehouse;
  setWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>;
};

export const ShelveAdd = ({ warehouse, setWarehouses }: ShelveAddProps) => {
  const canCreateWarehouses = useUserStore((s) => s.hasPermission(PermissionId.CREATE_WAREHOUSES));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [shelveProps, setShelveProps] = useState<Partial<Shelve>>();
  const { data, isLoading, error, fieldError } = useAddShelve(shelveProps);

  const inputBg = useColorModeValue('#f5f5f7', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('#f5f5f7', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const iconHoverBg = useColorModeValue('#e0dede', 'gray.600');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Estantería creada',
        description: `La estantería se creó correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setWarehouses((prev) =>
        prev.map((w) => {
          if (w.id === warehouse.id) {
            return { ...w, shelves: [...w.shelves, data] };
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

  const handleSubmit = (values: { name: string; description: string }) => {
    const shelve = {
      name: values.name,
      description: values.description,
      warehouseId: warehouse.id,
    };
    setShelveProps(shelve);
  };

  return (
    <>
      {canCreateWarehouses && (
        <IconButton
          aria-label="Agregar estantería"
          icon={<FaPlus />}
          onClick={onOpen}
          size="md"
          bg="transparent"
          _hover={{ bg: iconHoverBg }}
          disabled={!canCreateWarehouses}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nueva estantería
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ name: '', description: '' }}
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
