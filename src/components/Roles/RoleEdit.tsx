'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  VStack,
  Button,
  Box,
  Text,
  Progress,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Divider,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { PERMISSIONS_METADATA } from '@/entities/permissions/permissionMetadata';
import { Role } from '@/entities/role';
import { RoleDelete } from './RoleDelete';
import { useEffect, useState } from 'react';
import { useUpdateRole } from '@/hooks/roles';
import { validateEmpty } from '@/utils/validate';

type RoleEditProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (updatedRole: Role) => void;
};

export const RoleEdit = ({ isOpen, onClose, role, onSave }: RoleEditProps) => {
  const toast = useToast();
  const [roleProps, setRoleProps] = useState<Partial<Role>>();
  const { data, error, isLoading } = useUpdateRole(roleProps);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast({
        title: 'Rol modificado',
        description: `El rol ha sido modificadamente correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setRoleProps(undefined);
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

  const groupedPermissions = PERMISSIONS_METADATA.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof PERMISSIONS_METADATA>,
  );

  const handleSubmit = (values: { id: number; name: string; description: string; permissions: number[] }) => {
    const role = {
      id: values.id,
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    };
    setRoleProps(role);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader textAlign="center" fontSize="2rem">
          Editar rol
        </ModalHeader>
        {role && (
          <Formik
            initialValues={{
              id: role.id ?? 0,
              name: role.name ?? '',
              description: role.description ?? '',
              permissions: role.permissions ?? ([] as number[]),
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched, submitCount, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody px="2rem" pb="2rem" pt="0">
                  <Flex gap="2rem" align="start">
                    <Box flex="1">
                      <FormControl>
                        <FormLabel>Permisos</FormLabel>
                        <Box maxH="52vh" overflowY="auto" pr="0.5rem">
                          <Accordion allowMultiple>
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                              <AccordionItem key={group}>
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left" fontWeight="semibold">
                                      {group}
                                    </Box>
                                    <Text fontSize="sm" color="gray.600" mr="1rem">
                                      {perms.filter((perm) => values.permissions.includes(perm.id)).length}{' '}
                                      seleccionados
                                    </Text>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                  <Flex wrap="wrap" gap="0.75rem">
                                    {perms.map((perm) => (
                                      <Checkbox
                                        key={perm.id}
                                        isChecked={values.permissions.includes(perm.id)}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          const updated = checked
                                            ? [...values.permissions, perm.id]
                                            : values.permissions.filter((p) => p !== perm.id);
                                          setFieldValue('permissions', updated);
                                        }}
                                      >
                                        {perm.label}
                                      </Checkbox>
                                    ))}
                                  </Flex>
                                </AccordionPanel>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </Box>
                      </FormControl>
                    </Box>
                    <Divider orientation="vertical" h="27rem" />
                    <Flex flex="1" flexDir="column" justifyContent="space-between" h="27rem">
                      <Box>
                        <VStack spacing="1rem" align="stretch" height="100%">
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

                          <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                            <FormLabel>Descripción</FormLabel>
                            <Field
                              as={Textarea}
                              name="description"
                              bg="#f5f5f7"
                              borderColor="#f5f5f7"
                              fontSize="0.875rem"
                              resize="vertical"
                              minH="8rem"
                              validate={validateEmpty}
                            />
                          </FormControl>

                          {submitCount > 0 && Object.keys(errors).length > 0 && (
                            <Box>
                              <Text color="red.500" fontSize="0.875rem">
                                Debe completar todos los campos
                              </Text>
                            </Box>
                          )}
                        </VStack>
                      </Box>

                      <Box>
                        <Progress
                          h={isSubmitting ? '4px' : '1px'}
                          mb="1.5rem"
                          size="xs"
                          isIndeterminate={isSubmitting}
                          colorScheme="blue"
                        />

                        <HStack spacing="1rem" justify="space-between">
                          <Box>
                            <RoleDelete role={role} isUpdating={isSubmitting} onDeleted={onClose} />
                          </Box>
                          <Button
                            type="submit"
                            isLoading={isSubmitting}
                            bg="#4C88D8"
                            color="white"
                            _hover={{ backgroundColor: '#376bb0' }}
                            width="100%"
                            leftIcon={<FaCheck />}
                            py="1.375rem"
                          >
                            Confirmar
                          </Button>
                        </HStack>
                      </Box>
                    </Flex>
                  </Flex>
                </ModalBody>
              </form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
};
