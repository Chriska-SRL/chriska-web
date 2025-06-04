'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  VStack,
  Progress,
  Box,
  Text,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

const roles = [
  { id: 'admin', label: 'Administrador' },
  { id: 'editor', label: 'Editor' },
  { id: 'viewer', label: 'Lector' },
];

const estados = [
  { id: 'activo', label: 'Activo' },
  { id: 'inactivo', label: 'Inactivo' },
];

export const UserAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState<any>();

  useEffect(() => {
    if (formData) {
      toast({
        title: 'Usuario creado',
        description: `${formData.name} ha sido creado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      formData?.resetForm?.();
      setFormData(undefined);
      onClose();
    }
  }, [formData, toast, onClose]);

  const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
    setFormData({ ...values, resetForm });
    console.log('Usuario creado:', values);
  };

  return (
    <>
      <Button bg="#f2f2f2" _hover={{ bg: '#e0dede' }} leftIcon={<FaPlus />} onClick={onOpen}>
        Crear usuario
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0">
            Crear usuario
          </ModalHeader>
          <ModalCloseButton />

          <Formik
            initialValues={{ username: '', name: '', role: '', estado: '' }}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="1rem">
                    <FormControl isInvalid={submitCount > 0 && touched.username && !!errors.username}>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <Field
                        as={Input}
                        name="username"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                      <FormLabel>Nombre</FormLabel>
                      <Field
                        as={Input}
                        name="name"
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.role && !!errors.role}>
                      <FormLabel>Rol</FormLabel>
                      <Field
                        as={Select}
                        name="role"
                        placeholder="Seleccionar rol"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </Field>
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.estado && !!errors.estado}>
                      <FormLabel>Estado</FormLabel>
                      <Field
                        as={Select}
                        name="estado"
                        placeholder="Seleccionar estado"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                      >
                        {estados.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.label}
                          </option>
                        ))}
                      </Field>
                    </FormControl>

                    {submitCount > 0 && Object.keys(errors).length > 0 && (
                      <Box w="100%">
                        <Text color="red.500" fontSize="0.875rem" textAlign="left" pl="0.25rem">
                          Debe completar todos los campos
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <Box w="100%">
                    <Progress
                      h={false ? '4px' : '1px'}
                      size="xs"
                      isIndeterminate={false}
                      colorScheme="blue"
                      mb="1rem"
                    />
                    <Button
                      type="submit"
                      bg="#4C88D8"
                      color="white"
                      w="100%"
                      py="1.375rem"
                      _hover={{ bg: '#376bb0' }}
                      leftIcon={<FaCheck />}
                      isLoading={isSubmitting}
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
