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
} from '@chakra-ui/react';
import { User } from '@/entities/user';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { UserDelete } from './UserDelete';
import { useGetRoles } from '@/hooks/roles';
import { useEffect, useState } from 'react';
import { useUpdateUser } from '@/hooks/user';
import { validateEmpty } from '@/utils/validate';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
};

export const UserEdit = ({ isOpen, onClose, user }: Props) => {
  const toast = useToast();
  const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useGetRoles();

  const [userProps, setUserProps] = useState<Partial<User>>();
  const { data, error, isLoading } = useUpdateUser(userProps);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast({
        title: 'Usuario modificado',
        description: `El usuario ha sido modificado correctamente.`,
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="1.75rem" pb="0.5rem">
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
                      h="2.75rem"
                      validate={validateEmpty}
                      disabled={isSubmitting || isLoading}
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
                      disabled={isSubmitting || isLoading}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.roleId && !!errors.roleId}>
                    <FormLabel>Rol</FormLabel>
                    <Field
                      as={Select}
                      name="roleId"
                      placeholder="Seleccionar rol"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      h="2.75rem"
                      validate={validateEmpty}
                      disabled={isSubmitting || isLoading || isLoadingRoles}
                    >
                      {roles?.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
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
                      h="2.75rem"
                      validate={validateEmpty}
                      disabled={isSubmitting || isLoading}
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo</option>
                    </Field>
                  </FormControl>

                  {submitCount > 0 && Object.keys(errors).length > 0 && (
                    <Box w="100%">
                      <Text color="red.500" fontSize="0.85rem" textAlign="left">
                        Debe completar todos los campos.
                      </Text>
                    </Box>
                  )}
                </VStack>
              </ModalBody>

              <ModalFooter pb="1.5rem">
                <Box mt="0.5rem" w="100%">
                  <Progress
                    h={isSubmitting ? '4px' : '1px'}
                    mb="1.25rem"
                    size="xs"
                    isIndeterminate={isSubmitting}
                    colorScheme="blue"
                  />
                  <Box display="flex" gap="0.75rem">
                    {user && <UserDelete user={user} onDeleted={onClose} isUpdating={isLoading} />}
                    <Button
                      type="submit"
                      bg="#4C88D8"
                      color="white"
                      disabled={isSubmitting}
                      _hover={{ backgroundColor: '#376bb0' }}
                      width="100%"
                      leftIcon={<FaCheck />}
                      fontSize="0.95rem"
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
  );
};
