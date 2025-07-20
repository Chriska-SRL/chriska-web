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
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useAddUser, useTemporaryPassword } from '@/hooks/user';
import { User } from '@/entities/user';
import { useGetRoles } from '@/hooks/role';
import { validate } from '@/utils/validations/validate';
import { TemporaryPasswordModal } from './TemporaryPasswordModal';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type UserAddProps = {
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserAdd = ({ setUsers }: UserAddProps) => {
  const canCreateUsers = useUserStore((s) => s.hasPermission(Permission.CREATE_USERS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [userProps, setUserProps] = useState<Partial<User>>();
  const { data, isLoading, error, fieldError } = useAddUser(userProps);

  const [newUserId, setNewUserId] = useState<number>();
  const { data: temporalPassword, error: resetError } = useTemporaryPassword(newUserId);

  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

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
      setUsers((prev) => [...prev, data]);
      setNewUserId(data.id);
      onClose();
    }
  }, [data]);

  useEffect(() => {
    if (fieldError) {
      toast({ title: `Error`, description: fieldError.error, status: 'error', duration: 4000, isClosable: true });
    } else if (error) {
      toast({ title: 'Error inesperado', description: error, status: 'error', duration: 3000, isClosable: true });
    }
  }, [error, fieldError]);

  useEffect(() => {
    if (temporalPassword) {
      setTempPassword(temporalPassword.password);
      setIsPasswordModalOpen(true);
    }
  }, [temporalPassword]);

  useEffect(() => {
    if (resetError) {
      toast({
        title: 'Error al generar contraseña temporal',
        description: resetError,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [resetError]);

  const handleSubmit = (values: { username: string; name: string; roleId: string; estado: string }) => {
    const user = {
      username: values.username,
      name: values.name,
      password: 'Temporal.123',
      isEnabled: values.estado === 'Activo',
      roleId: Number(values.roleId),
    };
    setUserProps(user);
  };

  return (
    <>
      {canCreateUsers && (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          w={{ base: '100%', md: 'auto' }}
          px="1.5rem"
        >
          Nuevo
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'sm', md: 'md' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nuevo usuario
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
                  <VStack spacing="0.75rem">
                    <FormControl isInvalid={submitCount > 0 && touched.username && !!errors.username}>
                      <FormLabel>Nombre de usuario</FormLabel>
                      <Field
                        as={Input}
                        name="username"
                        type="text"
                        bg={inputBg}
                        borderColor={inputBorder}
                        h="2.75rem"
                        disabled={isLoading}
                        validate={(value: string) => {
                          const emptyError = validate(value);
                          if (emptyError) return emptyError;
                          if (!/^[a-z]+$/.test(value)) return 'Debe ser una sola palabra en minúsculas';
                          return undefined;
                        }}
                      />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
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
                        disabled={isLoading}
                        validate={validate}
                      />
                      <FormErrorMessage>{errors.name}</FormErrorMessage>
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
                        validate={validate}
                        disabled={isLoadingRoles || isLoading}
                      >
                        {roles?.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </Field>
                      <FormErrorMessage>{errors.roleId}</FormErrorMessage>
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
                        validate={validate}
                        disabled={isLoading}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </Field>
                      <FormErrorMessage>{errors.estado}</FormErrorMessage>
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
            )}
          </Formik>
        </ModalContent>
      </Modal>

      <TemporaryPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        password={tempPassword}
      />
    </>
  );
};
