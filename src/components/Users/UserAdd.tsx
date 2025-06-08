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
  Select,
  useToast,
  VStack,
  Progress,
  Box,
  Text,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAddUser } from '@/hooks/user';
import { User } from '@/entities/user';

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

const roles = [
  { id: 1, name: 'Administrador', description: 'Acceso total', permissions: [] },
  { id: 2, name: 'Editor', description: 'Puede editar contenidos', permissions: [] },
  { id: 3, name: 'Lector', description: 'Solo lectura', permissions: [] },
];

const estados = ['Activo', 'Inactivo'];

export const UserAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [userProps, setUserProps] = useState<Partial<User>>();
  const { data, error, isLoading } = useAddUser(userProps);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast({
        title: 'Usuario creado',
        description: `El usuario ha sido creado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setUserProps(undefined);
      onClose();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error]);

  const handleSubmit = (values: { username: string; name: string; role: string; estado: string }) => {
    const role = roles.find((r) => r.name === values.role);
    const user = {
      userName: values.username,
      name: values.name,
      password: 'asdasdasdasd',
      isEnabled: values.estado === 'Activo',
      roleId: role?.id ?? 0,
    };
    setUserProps(user);
  };

  return (
    <>
      <Button
        bg="#f2f2f2"
        _hover={{ bg: '#e0dede' }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        Crear usuario
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Crear usuario
          </ModalHeader>
          <Formik
            initialValues={{ username: '', name: '', role: '', estado: '' }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
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
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoading}
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
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoading}
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
                        disabled={isLoading}
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.name}>
                            {role.name}
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
                        disabled={isLoading}
                      >
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
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
