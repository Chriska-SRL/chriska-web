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
  FormErrorMessage,
  ModalFooter,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { FiShield, FiFileText } from 'react-icons/fi';
import { PERMISSIONS_METADATA } from '@/utils/permissionMetadata';
import { Role } from '@/entities/role';
import { useEffect, useState } from 'react';
import { useUpdateRole } from '@/hooks/role';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type RoleEditProps = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export const RoleEdit = ({ isOpen, onClose, role, setRoles }: RoleEditProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const toast = useToast();
  const [roleProps, setRoleProps] = useState<Partial<Role>>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError } = useUpdateRole(roleProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
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
      setRoles((prev) => prev.map((r) => (r.id === data.id ? data : r)));
      setRoleProps(undefined);
      handleClose();
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

  const handleClose = () => {
    setRoleProps(undefined);
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
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'xs', md: '3xl' }}
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
            Editar rol
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
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
                {({ handleSubmit, values, setFieldValue, errors, touched, submitCount, dirty, resetForm }) => {
                  // Actualizar la instancia de formik solo cuando cambie
                  useEffect(() => {
                    setFormikInstance({ dirty, resetForm });
                  }, [dirty, resetForm]);

                  return (
                    <form id="role-edit-form" onSubmit={handleSubmit}>
                      <Flex
                        gap="2rem"
                        align="start"
                        direction={{ base: 'column', md: 'row' }}
                        maxH={{ base: 'none', md: '70dvh' }}
                      >
                        <Box flex="1">
                          <FormControl>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiShield} boxSize="1rem" />
                                <Text>Permisos</Text>
                              </HStack>
                            </FormLabel>
                            <Box maxH={{ base: '32dvh', md: '52dvh' }} overflowY="auto">
                              <Accordion allowMultiple>
                                {Object.entries(groupedPermissions).map(([group, perms]) => (
                                  <AccordionItem key={group}>
                                    <h2>
                                      <AccordionButton>
                                        <Box flex="1" textAlign="left" fontWeight="semibold">
                                          {group}
                                        </Box>
                                        <Text fontSize="sm" color={selectedCountColor} mx="1rem">
                                          {perms.filter((perm) => values.permissions.includes(perm.id)).length}{' '}
                                          {isMobile ? 'selec.' : 'seleccionados'}
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
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiShield} boxSize="1rem" />
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
                                  fontSize="0.875rem"
                                  h="2.75rem"
                                  validate={validate}
                                />
                                <FormErrorMessage>{errors.name}</FormErrorMessage>
                              </FormControl>

                              <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                                <FormLabel fontWeight="semibold">
                                  <HStack spacing="0.5rem">
                                    <Icon as={FiFileText} boxSize="1rem" />
                                    <Text>Descripción</Text>
                                  </HStack>
                                </FormLabel>
                                <Field
                                  as={Textarea}
                                  name="description"
                                  bg={inputBg}
                                  border="1px solid"
                                  borderColor={inputBorder}
                                  fontSize="0.875rem"
                                  resize="vertical"
                                  minH="8rem"
                                  validate={validateEmpty}
                                  rows={4}
                                />
                                <FormErrorMessage>{errors.description}</FormErrorMessage>
                              </FormControl>
                            </VStack>
                          </Box>
                          <ModalFooter flexShrink={0} borderTop="1px solid" borderColor={inputBorder} pt="1rem" px={0}>
                            <HStack spacing="0.5rem" w="100%">
                              <Button
                                variant="ghost"
                                onClick={handleClose}
                                disabled={isLoading}
                                size="sm"
                                leftIcon={<FaTimes />}
                              >
                                Cancelar
                              </Button>
                              <Button
                                form="role-edit-form"
                                type="submit"
                                colorScheme="blue"
                                variant="outline"
                                isLoading={isLoading}
                                loadingText="Guardando..."
                                leftIcon={<FaCheck />}
                                size="sm"
                                flex="1"
                              >
                                Guardar cambios
                              </Button>
                            </HStack>
                          </ModalFooter>
                        </Flex>
                      </Flex>
                    </form>
                  );
                }}
              </Formik>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <UnsavedChangesModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleClose}
      />
    </>
  );
};
