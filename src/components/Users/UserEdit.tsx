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
  useToast,
  VStack,
  Button,
  Progress,
  Box,
  Text,
} from '@chakra-ui/react';
import { User } from '@/entities/user/user';
import { Formik, Field } from 'formik';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

const roles = [
  { id: 1, name: 'Administrador', description: 'Acceso total', permissions: [] },
  { id: 2, name: 'Editor', description: 'Puede editar contenidos', permissions: [] },
  { id: 3, name: 'Lector', description: 'Solo lectura', permissions: [] },
];

const estados = ['Activo', 'Inactivo'];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
};

export const UserEdit = ({ isOpen, onClose, user, onSave }: Props) => {
  const toast = useToast();
  const [formData, setFormData] = useState<any>();

  useEffect(() => {
    if (formData) {
      toast({
        title: 'Usuario actualizado',
        description: `${formData.name} ha sido modificado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      formData?.resetForm?.();
      setFormData(undefined);
      onClose();
    }
  }, [formData, toast, onClose]);

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="1.75rem" pb="0.5rem">
          Editar usuario
        </ModalHeader>
        <Formik
          initialValues={{
            username: user.username,
            name: user.name,
            role: user.role.name,
            isEnabled: user.isEnabled ? 'Activo' : 'Inactivo',
          }}
          onSubmit={(values, { resetForm }) => {
            const selectedRole = roles.find((r) => r.name === values.role);
            if (!selectedRole) {
              toast({
                title: 'Error',
                description: 'Rol seleccionado no válido.',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
              return;
            }

            const updatedUser: User = {
              ...user,
              username: values.username,
              name: values.name,
              role: selectedRole,
              isEnabled: values.isEnabled === 'Activo',
            };

            setFormData({ ...values, resetForm });
            onSave(updatedUser);
          }}
          validateOnChange={true}
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount, isSubmitting }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0">
                <VStack spacing="1rem">
                  <FormControl isInvalid={submitCount > 0 && touched.username && !!errors.username}>
                    <FormLabel fontSize="0.9rem">Nombre de usuario</FormLabel>
                    <Field
                      as={Input}
                      name="username"
                      type="text"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      fontSize="0.9rem"
                      h="2.75rem"
                      validate={validateEmpty}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                    <FormLabel fontSize="0.9rem">Nombre</FormLabel>
                    <Field
                      as={Input}
                      name="name"
                      type="text"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      fontSize="0.9rem"
                      h="2.75rem"
                      validate={validateEmpty}
                    />
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.role && !!errors.role}>
                    <FormLabel fontSize="0.9rem">Rol</FormLabel>
                    <Field
                      as={Select}
                      name="role"
                      placeholder="Seleccionar rol"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      fontSize="0.9rem"
                      h="2.75rem"
                      validate={validateEmpty}
                    >
                      {roles.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </Field>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.isEnabled && !!errors.isEnabled}>
                    <FormLabel fontSize="0.9rem">Estado</FormLabel>
                    <Field
                      as={Select}
                      name="isEnabled"
                      placeholder="Seleccionar estado"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      fontSize="0.9rem"
                      h="2.75rem"
                      validate={validateEmpty}
                    >
                      {estados.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
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
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    bg="#4C88D8"
                    color="white"
                    _hover={{ backgroundColor: '#376bb0' }}
                    width="100%"
                    leftIcon={<FaCheck />}
                    py="1.375rem"
                    fontSize="0.95rem"
                  >
                    Guardar cambios
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
