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
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAddUser } from '@/hooks/user';
import { User } from '@/entities/user';
import { useGetRoles } from '@/hooks/roles';
import { validateEmpty } from '@/utils/validate';

type UserAddProps = {
  setLocalUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserAdd = ({ setLocalUsers }: UserAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [userProps, setUserProps] = useState<Partial<User>>();
  const { data, isLoading, error, fieldError } = useAddUser(userProps);
  const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useGetRoles();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Usuario creado',
        description: `El usuario ha sido creado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setUserProps(undefined);
      setLocalUsers((prev) => [...prev, data]);
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

  const handleSubmit = (values: { username: string; name: string; roleId: string; estado: string }) => {
    const user = {
      username: values.username,
      name: values.name,
      isEnabled: values.estado === 'Activo',
      roleId: Number(values.roleId),
    };
    setUserProps(user);
  };

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
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
          <ModalCloseButton />
          <Formik
            initialValues={{ username: '', name: '', roleId: '', estado: '' }}
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
                        bg={inputBg}
                        borderColor={inputBorder}
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
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoading}
                      />
                    </FormControl>

                    <FormControl isInvalid={submitCount > 0 && touched.roleId && !!errors.roleId}>
                      <FormLabel>Rol</FormLabel>
                      <Field
                        as={Select}
                        name="roleId"
                        placeholder="Seleccionar rol"
                        bg={inputBg}
                        borderColor={inputBorder}
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoadingRoles || isLoading}
                      >
                        {roles?.map((role) => (
                          <option key={role.id} value={role.id}>
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
                        bg={inputBg}
                        borderColor={inputBorder}
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                        disabled={isLoading}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
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
