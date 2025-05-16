'use client';

import { User } from '@/entities/user';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
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
import { Formik, Field } from 'formik';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';

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
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2rem" pb="0">
          Editar usuario
        </ModalHeader>
        <ModalCloseButton />

        <Formik
          initialValues={{
            username: user.username,
            name: user.name,
            role: user.role,
            is_enabled: user.is_enabled,
          }}
          onSubmit={(values, { resetForm }) => {
            setFormData({ ...values, resetForm });
            onSave({ ...user, ...values });
          }}
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

                  <FormControl isInvalid={submitCount > 0 && touched.is_enabled && !!errors.is_enabled}>
                    <FormLabel>Estado</FormLabel>
                    <Field
                      as={Select}
                      name="is_enabled"
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
                  <Progress h={false ? '4px' : '1px'} size="xs" isIndeterminate={false} colorScheme="blue" mb="1rem" />
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
