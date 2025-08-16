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
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
  useDisclosure,
  HStack,
  Text,
  Icon,
} from '@chakra-ui/react';
import { User } from '@/entities/user';
import { Formik, Field } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiUser, FiShield, FiSettings } from 'react-icons/fi';
import { useGetRoles } from '@/hooks/role';
import { useEffect, useState } from 'react';
import { useTemporaryPassword, useUpdateUser } from '@/hooks/user';
import { validate } from '@/utils/validations/validate';
import { TemporaryPasswordModal } from '../TemporaryPasswordModal';
import { IoReload } from 'react-icons/io5';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type UserEditProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserEdit = ({ isOpen, onClose, user, setUsers }: UserEditProps) => {
  const toast = useToast();
  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  const [userProps, setUserProps] = useState<Partial<User>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
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
      openTempPasswordModal();
      // onClose(); Revisar por que no funciona bien
    }
  }, [resetData]);

  const handleResetPassword = () => {
    if (user) setResetUserId(user.id);
  };

  const handleCloseTempPasswordModal = () => {
    closeTempPasswordModal();
    setResetUserId(undefined);
  };

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Usuario actualizado',
        description: 'El usuario ha sido actualizado correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setUsers((prevUsers) => prevUsers.map((u) => (u.id === data.id ? { ...u, ...data } : u)));
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

  const handleClose = () => {
    setUserProps(undefined);
    setShowConfirmDialog(false);
    if (formikInstance && formikInstance.resetForm) {
      formikInstance.resetForm();
    }
    onClose();
  };

  const handleOverlayClick = () => {
    if (formikInstance && formikInstance.dirty) {
      setShowConfirmDialog(true);
    } else {
      handleClose();
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: 'md' }}
        isCentered
        closeOnOverlayClick={false}
        onOverlayClick={handleOverlayClick}
      >
        <ModalOverlay />
        <ModalContent maxH="90dvh" display="flex" flexDirection="column">
          <ModalHeader
            py="0.75rem"
            textAlign="center"
            fontSize="1.5rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={inputBorder}
          >
            Editar usuario
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
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
              {({ handleSubmit, errors, touched, submitCount, dirty, resetForm }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="user-edit-form" onSubmit={handleSubmit}>
                    <VStack spacing="0.75rem">
                      <FormControl
                        isInvalid={
                          (submitCount > 0 && touched.username && !!errors.username) || fieldError?.campo === 'Username'
                        }
                      >
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiUser} boxSize="1rem" />
                            <Text>Nombre de usuario</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="username"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
                          h="2.75rem"
                          validate={validate}
                          disabled={isLoading}
                        />
                        <FormErrorMessage>{errors.username}</FormErrorMessage>
                      </FormControl>

                      <FormControl
                        isInvalid={(submitCount > 0 && touched.name && !!errors.name) || fieldError?.campo === 'Name'}
                      >
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiUser} boxSize="1rem" />
                            <Text>Nombre</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Input}
                          name="name"
                          type="text"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
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
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiShield} boxSize="1rem" />
                            <Text>Rol</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Select}
                          name="roleId"
                          placeholder="Seleccionar rol"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
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
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiSettings} boxSize="1rem" />
                            <Text>Estado</Text>
                          </HStack>
                        </FormLabel>
                        <Field
                          as={Select}
                          name="estado"
                          placeholder="Seleccionar estado"
                          bg={inputBg}
                          border="1px solid"
                          borderColor={inputBorder}
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
                        mt="0.625rem"
                      >
                        Restablecer contraseña
                      </Button>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm" leftIcon={<FaTimes />}>
                Cancelar
              </Button>
              <Button
                form="user-edit-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Guardando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Guardar cambios
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TemporaryPasswordModal
        isOpen={isTempPasswordModalOpen}
        onClose={handleCloseTempPasswordModal}
        password={resetData?.password ?? ''}
      />

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};
