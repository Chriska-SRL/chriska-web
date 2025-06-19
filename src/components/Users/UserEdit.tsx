// UserEdit.tsx
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
  Select,
  VStack,
  Button,
  Progress,
  Box,
  Text,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  useDisclosure,
} from '@chakra-ui/react';
import { User } from '@/entities/user';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useGetRoles } from '@/hooks/roles';
import { useEffect, useState } from 'react';
import { useDeleteUser, useTemporaryPassword, useUpdateUser } from '@/hooks/user';
import { validate } from '@/utils/validate';
import { TemporaryPasswordModal } from './TemporaryPasswordModal';
import { IoReload } from 'react-icons/io5';
import { GenericDelete } from '../shared/GenericDelete';

type UserEditProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setLocalUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserEdit = ({ isOpen, onClose, user, setLocalUsers }: UserEditProps) => {
  const toast = useToast();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  const [userProps, setUserProps] = useState<Partial<User>>();
  const { data, isLoading, error, fieldError } = useUpdateUser(userProps);

  const {
    isOpen: isTempPasswordModalOpen,
    onOpen: openTempPasswordModal,
    onClose: closeTempPasswordModal,
  } = useDisclosure();
  const [resetUserId, setResetUserId] = useState<number | undefined>();
  const { data: resetData, isLoading: isLoadingReset, error: resetError } = useTemporaryPassword(resetUserId);

  useEffect(() => {
    if (resetData) {
      onClose();
      openTempPasswordModal();
    }
  }, [resetData]);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Usuario actualizado',
        description: 'El usuario ha sido actualizado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalUsers((prevUsers) => prevUsers.map((u) => (u.id === data.id ? { ...u, ...data } : u)));
      setUserProps(undefined);
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

  useEffect(() => {
    if (resetError) {
      toast({
        title: 'Error al resetear contraseña',
        description: resetError,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [resetError]);

  const handleSubmit = (values: { id: number; username: string; name: string; roleId: number; estado: string }) => {
    const user = {
      id: values.id,
      username: values.username,
      name: values.name,
      isEnabled: values.estado === 'Activo',
      roleId: values.roleId ?? 0,
    };
    setUserProps(user);
  };

  const handleResetPassword = () => {
    if (user) setResetUserId(user.id);
  };

  const handleCloseTempPasswordModal = () => {
    closeTempPasswordModal();
    setResetUserId(undefined);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent mx="auto" borderRadius="lg">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Editar usuario
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              id: user?.id ?? 0,
              username: user?.username ?? '',
              name: user?.name ?? '',
              roleId: user?.role.id ?? 0,
              estado: user?.isEnabled ? 'Activo' : 'Inactivo',
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="0.75rem">
                    <FormControl
                      isInvalid={
                        (submitCount > 0 && touched.username && !!errors.username) || fieldError?.campo === 'Username'
                      }
                    >
                      <FormLabel>Nombre de usuario</FormLabel>
                      <Field
                        as={Input}
                        name="username"
                        type="text"
                        bg={inputBg}
                        borderColor={borderColor}
                        h="2.75rem"
                        validate={validate}
                        disabled={isLoading}
                      />
                      <FormErrorMessage>{errors.username}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={(submitCount > 0 && touched.name && !!errors.name) || fieldError?.campo === 'Name'}
                    >
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

                    <FormControl
                      isInvalid={
                        (submitCount > 0 && touched.roleId && !!errors.roleId) || fieldError?.campo === 'RoleId'
                      }
                    >
                      <FormLabel>Rol</FormLabel>
                      <Field
                        as={Select}
                        name="roleId"
                        placeholder="Seleccionar rol"
                        bg={inputBg}
                        borderColor={borderColor}
                        h="2.75rem"
                        validate={validate}
                        disabled={isLoading || isLoadingRoles}
                      >
                        {roles?.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </Field>
                      <FormErrorMessage>{errors.roleId}</FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isInvalid={
                        (submitCount > 0 && touched.estado && !!errors.estado) || fieldError?.campo === 'Estado'
                      }
                    >
                      <FormLabel>Estado</FormLabel>
                      <Field
                        as={Select}
                        name="estado"
                        placeholder="Seleccionar estado"
                        bg={inputBg}
                        borderColor={borderColor}
                        h="2.75rem"
                        validate={validate}
                        disabled={isLoading}
                      >
                        <option value="Activo">Activo</option>
                        <option value="Inactivo">Inactivo</option>
                      </Field>
                      <FormErrorMessage>{errors.estado}</FormErrorMessage>
                    </FormControl>

                    <Button
                      onClick={handleResetPassword}
                      isLoading={isLoadingReset}
                      variant="outline"
                      colorScheme="blue"
                      w="100%"
                      leftIcon={<IoReload />}
                      mt="0.25rem"
                    >
                      Restablecer contraseña
                    </Button>
                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      mb="1.25rem"
                      size="xs"
                      isIndeterminate={isLoading}
                      colorScheme="blue"
                    />
                    <Box display="flex" gap="0.75rem">
                      {user && (
                        <GenericDelete
                          item={{ id: user.id, name: user.name }}
                          isUpdating={isLoading}
                          setLocalItems={setLocalUsers}
                          useDeleteHook={useDeleteUser}
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

      <TemporaryPasswordModal
        isOpen={isTempPasswordModalOpen}
        onClose={handleCloseTempPasswordModal}
        password={resetData?.password ?? ''}
      />
    </>
  );
};
