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
  useColorModeValue,
  FormErrorMessage,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiUser, FiMail, FiShield, FiActivity } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useAddUser } from '@/hooks/user';
import { temporaryPassword } from '@/services/user';
import { User } from '@/entities/user';
import { useGetRoles } from '@/hooks/role';
import { validate } from '@/utils/validations/validate';
import { TemporaryPasswordModal } from '../TemporaryPasswordModal';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type UserAddProps = {
  isLoading: boolean;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

type UserAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const UserAddModal = ({ isOpen, onClose, setUsers }: UserAddModalProps) => {
  const toast = useToast();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');

  const [userProps, setUserProps] = useState<Partial<User>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useAddUser(userProps);

  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const { data: roles, isLoading: isLoadingRoles } = useGetRoles();

  const handleClose = () => {
    setUserProps(undefined);
    setTempPassword(null);
    setIsPasswordModalOpen(false);
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

  useEffect(() => {
    if (data) {
      toast({
        title: 'Usuario creado',
        description: 'El usuario ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setUserProps(undefined);
      setUsers((prev) => [...prev, data]);

      // Llamar directamente al servicio de contraseña temporal
      temporaryPassword(data.id)
        .then((response) => {
          setTempPassword(response.password);
          setIsPasswordModalOpen(true);
        })
        .catch((error) => {
          toast({
            title: 'Error al generar contraseña temporal',
            description: error.message || 'Error desconocido',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
          onClose(); // Cerrar el modal principal aunque haya error
        });
    }
  }, [data, setUsers, toast, onClose]);

  useEffect(() => {
    if (fieldError) {
      toast({
        title: 'Error',
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
  }, [error, fieldError, toast]);

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
      <Modal
        isOpen={isOpen && !isPasswordModalOpen}
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
            Nuevo usuario
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                username: '',
                name: '',
                roleId: '',
                estado: '',
              }}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="user-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1rem" align="stretch">
                      <Field
                        name="username"
                        validate={(value: string) => {
                          const emptyError = validate(value);
                          if (emptyError) return emptyError;
                          if (!/^[a-z]+$/.test(value)) return 'Debe ser una sola palabra en minúsculas';
                          return undefined;
                        }}
                      >
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.username && !!errors.username}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiMail} boxSize="1rem" />
                                <Text>Nombre de usuario</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el nombre de usuario"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.username}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="name" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiUser} boxSize="1rem" />
                                <Text>Nombre completo</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el nombre completo"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="roleId" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.roleId && !!errors.roleId}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiShield} boxSize="1rem" />
                                <Text>Rol</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar rol"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoadingRoles || isLoading}
                            >
                              {roles?.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </Select>
                            <FormErrorMessage>{errors.roleId}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="estado" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.estado && !!errors.estado}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiActivity} boxSize="1rem" />
                                <Text>Estado</Text>
                              </HStack>
                            </FormLabel>
                            <Select
                              {...field}
                              placeholder="Seleccionar estado"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            >
                              <option value="Activo">Activo</option>
                              <option value="Inactivo">Inactivo</option>
                            </Select>
                            <FormErrorMessage>{errors.estado}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </VStack>
                  </form>
                );
              }}
            </Formik>
          </ModalBody>

          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem">
            <HStack spacing="0.5rem">
              <Button variant="ghost" onClick={handleClose} disabled={isLoading} size="sm">
                Cancelar
              </Button>
              <Button
                form="user-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear usuario
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <TemporaryPasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          onClose(); // Cerrar el modal principal cuando se cierre el modal de contraseña
        }}
        password={tempPassword}
      />

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};

// Componente principal que controla la apertura del modal
export const UserAdd = ({ isLoading: isLoadingUsers, setUsers }: UserAddProps) => {
  const canCreateUsers = useUserStore((s) => s.hasPermission(Permission.CREATE_USERS));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateUsers) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingUsers}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <UserAddModal isOpen={isOpen} onClose={onClose} setUsers={setUsers} />}
    </>
  );
};
