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
} from '@chakra-ui/react';
import { User } from '@/entities/user';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { UserDelete } from './UserDelete';
import { useGetRoles } from '@/hooks/roles';

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

// const roles = [
//   { id: 1, name: 'Administrador', description: 'Acceso total', permissions: [] },
//   { id: 2, name: 'Editor', description: 'Puede editar contenidos', permissions: [] },
//   { id: 3, name: 'Lector', description: 'Solo lectura', permissions: [] },
// ];

const estados = ['Activo', 'Inactivo'];

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (updatedUser: User) => void;
};

export const UserEdit = ({ isOpen, onClose, user, onSave }: Props) => {
  const { data: roles, isLoading, error } = useGetRoles();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="1.75rem" pb="0.5rem">
          Editar usuario
        </ModalHeader>
        <Formik
          initialValues={{
            username: user?.username,
            name: user?.name,
            role: user?.role.name,
            isEnabled: user?.isEnabled ? 'Activo' : 'Inactivo',
          }}
          onSubmit={(values, { resetForm }) => {}}
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
                      disabled={isSubmitting}
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
                      disabled={isSubmitting}
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
                      h="2.75rem"
                      validate={validateEmpty}
                      disabled={isSubmitting || isLoading}
                    >
                      {roles?.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                    </Field>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.isEnabled && !!errors.isEnabled}>
                    <FormLabel>Estado</FormLabel>
                    <Field
                      as={Select}
                      name="isEnabled"
                      placeholder="Seleccionar estado"
                      bg="#f5f5f7"
                      borderColor="#f5f5f7"
                      h="2.75rem"
                      validate={validateEmpty}
                      disabled={isSubmitting}
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
                  <Box display="flex" gap="0.75rem">
                    {user && <UserDelete user={user} onDeleted={onClose} />}
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
