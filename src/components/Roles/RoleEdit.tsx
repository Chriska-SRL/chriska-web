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
  useToast,
  useMediaQuery,
  useColorModeValue,
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
  setLocalRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export const RoleEdit = ({ isOpen, onClose, role, setLocalRoles }: RoleEditProps) => {
  const toast = useToast();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [roleProps, setRoleProps] = useState<Partial<Role>>();
  const { data, isLoading, error, fieldError } = useUpdateRole(roleProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
  const selectedCountColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Rol modificado',
        description: `El rol ha sido modificado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalRoles((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      setRoleProps(undefined);
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
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'auto', md: '6xl' }} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2rem">
          Editar rol
        </ModalHeader>
        <ModalCloseButton />
        {role && (
          <Formik
            initialValues={{
              id: role.id,
              name: role.name ?? '',
              description: role.description ?? '',
              permissions: role.permissions ?? [],
            }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody px="2rem" pb="2rem" pt="0">
                  <Flex
                    gap="2rem"
                    align="start"
                    direction={{ base: 'column', md: 'row' }}
                    maxH={{ base: 'none', md: '70vh' }}
                  >
                    <Box flex="1">
                      <FormControl>
                        <FormLabel>Permisos</FormLabel>
                        <Box maxH={{ base: '32vh', md: '52vh' }} overflowY="auto" pr="0.5rem">
                          <Accordion allowMultiple>
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                              <AccordionItem key={group}>
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left" fontWeight="semibold">
                                      {group}
                                    </Box>
                                    <Text fontSize="sm" color={selectedCountColor} mr="1rem">
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

                    <Divider orientation="vertical" h="27rem" display={{ base: 'none', md: 'block' }} />

                    <Flex flex="1" w="100%" flexDir="column" justifyContent="space-between" minW={0}>
                      <Box>
                        <VStack spacing="1rem" align="stretch">
                          <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                            <FormLabel>Nombre</FormLabel>
                            <Field
                              as={Input}
                              name="name"
                              type="text"
                              bg={inputBg}
                              borderColor={borderColor}
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
                              bg={inputBg}
                              borderColor={borderColor}
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
                          h={isLoading ? '4px' : '1px'}
                          my="1.5rem"
                          size="xs"
                          isIndeterminate={isLoading}
                          colorScheme="blue"
                        />

                        <Flex gap="1rem" align={{ base: 'stretch', md: 'center' }} w="100%">
                          <RoleDelete
                            role={role}
                            isUpdating={isLoading}
                            onDeleted={onClose}
                            setLocalRoles={setLocalRoles}
                          />

                          <Button
                            type="submit"
                            isLoading={isLoading}
                            bg="#4C88D8"
                            color="white"
                            _hover={{ backgroundColor: '#376bb0' }}
                            w="100%"
                            leftIcon={<FaCheck />}
                            py="1.375rem"
                          >
                            Guardar cambios
                          </Button>
                        </Flex>
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
