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
  Textarea,
  useToast,
  VStack,
  Box,
  Text,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  useColorModeValue,
  FormErrorMessage,
  useMediaQuery,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { FiUser, FiFileText, FiShield } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { Role } from '@/entities/role';
import { useAddRole } from '@/hooks/role';
import { PERMISSIONS_METADATA } from '@/utils/permissionMetadata';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';
import { UnsavedChangesModal } from '@/components/shared/UnsavedChangesModal';

type RoleAddProps = {
  isLoading: boolean;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

type RoleAddModalProps = {
  isOpen: boolean;
  onClose: () => void;
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

// Componente interno que contiene todos los hooks y lógica del formulario
const RoleAddModal = ({ isOpen, onClose, setRoles }: RoleAddModalProps) => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const toast = useToast();

  // Generate unique ID suffix for this modal instance
  const modalId = `add-${Date.now()}`;

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formikInstance, setFormikInstance] = useState<any>(null);
  const { data, isLoading, error, fieldError, mutate } = useAddRole();

  const groupedPermissions = PERMISSIONS_METADATA.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof PERMISSIONS_METADATA>,
  );

  const handleClose = () => {
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
        title: 'Rol creado',
        description: 'El rol ha sido creado correctamente.',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      setRoles((prev) => [...prev, data]);
      onClose();
    }
  }, [data, setRoles, toast, onClose]);

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

  const handleSubmit = async (values: { name: string; description: string; permissions: number[] }) => {
    const role = {
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    };
    await mutate(role);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size={{ base: 'full', md: 'md' }}
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
            Nuevo rol
          </ModalHeader>

          <ModalBody pt="1rem" pb="1.5rem" flex="1" overflowY="auto">
            <Formik
              initialValues={{
                name: '',
                description: '',
                permissions: [] as number[],
              }}
              onSubmit={handleSubmit}
              enableReinitialize
              validateOnChange={true}
              validateOnBlur={false}
            >
              {({ handleSubmit, values, setFieldValue, dirty, resetForm, errors, touched, submitCount }) => {
                // Actualizar la instancia de formik solo cuando cambie
                useEffect(() => {
                  setFormikInstance({ dirty, resetForm });
                }, [dirty, resetForm]);

                return (
                  <form id="role-add-form" onSubmit={handleSubmit}>
                    <VStack spacing="1.5rem" align="stretch">
                      <Field name="name" validate={validate}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiUser} boxSize="1rem" />
                                <Text>Nombre</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Input
                              {...field}
                              placeholder="Ingrese el nombre del rol"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                            />
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="description" validate={validateEmpty}>
                        {({ field }: any) => (
                          <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                            <FormLabel fontWeight="semibold">
                              <HStack spacing="0.5rem">
                                <Icon as={FiFileText} boxSize="1rem" />
                                <Text>Descripción</Text>
                                <Text color="red.500">*</Text>
                              </HStack>
                            </FormLabel>
                            <Textarea
                              {...field}
                              placeholder="Ingrese una descripción del rol"
                              bg={inputBg}
                              border="1px solid"
                              borderColor={inputBorder}
                              disabled={isLoading}
                              resize="vertical"
                              minH="8rem"
                              rows={4}
                            />
                            <FormErrorMessage>{errors.description}</FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>

                      <FormControl>
                        <FormLabel fontWeight="semibold">
                          <HStack spacing="0.5rem">
                            <Icon as={FiShield} boxSize="1rem" />
                            <Text>Permisos</Text>
                          </HStack>
                        </FormLabel>
                        <Box overflowY="auto" pr="0.5rem">
                          <Accordion allowMultiple>
                            {Object.entries(groupedPermissions).map(([group, perms]) => (
                              <AccordionItem key={group}>
                                <h2>
                                  <AccordionButton>
                                    <Box flex="1" textAlign="left" fontWeight="semibold">
                                      {group}
                                    </Box>
                                    <HStack spacing="0.75rem" onClick={(e) => e.stopPropagation()} pr="0.5rem">
                                      <Checkbox
                                        isChecked={perms.every((perm) => values.permissions.includes(perm.id))}
                                        isIndeterminate={
                                          perms.some((perm) => values.permissions.includes(perm.id)) &&
                                          !perms.every((perm) => values.permissions.includes(perm.id))
                                        }
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          const groupPermIds = perms.map((perm) => perm.id);
                                          const updated = checked
                                            ? [...new Set([...values.permissions, ...groupPermIds])]
                                            : values.permissions.filter((p) => !groupPermIds.includes(p));
                                          setFieldValue('permissions', updated);
                                        }}
                                        disabled={isLoading}
                                        size="md"
                                      />
                                      <Text fontSize="sm" color={textColor}>
                                        {perms.filter((perm) => values.permissions.includes(perm.id)).length}{' '}
                                        {isMobile ? 'selec.' : 'seleccionados'}
                                      </Text>
                                    </HStack>
                                    <AccordionIcon />
                                  </AccordionButton>
                                </h2>
                                <AccordionPanel pb={4}>
                                  <Flex wrap="wrap" gap="0.75rem">
                                    {perms.map((perm) => (
                                      <Checkbox
                                        key={perm.id}
                                        id={`perm-${modalId}-${perm.id}`}
                                        isChecked={values.permissions.includes(perm.id)}
                                        onChange={(e) => {
                                          const checked = e.target.checked;
                                          const updated = checked
                                            ? [...values.permissions, perm.id]
                                            : values.permissions.filter((p) => p !== perm.id);
                                          setFieldValue('permissions', updated);
                                        }}
                                        disabled={isLoading}
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
                form="role-add-form"
                type="submit"
                colorScheme="blue"
                variant="outline"
                isLoading={isLoading}
                loadingText="Creando..."
                leftIcon={<FaCheck />}
                size="sm"
              >
                Crear rol
              </Button>
            </HStack>
          </ModalFooter>
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

// Componente principal que controla la apertura del modal
export const RoleAdd = ({ isLoading: isLoadingRoles, setRoles }: RoleAddProps) => {
  const canCreateRoles = useUserStore((s) => s.hasPermission(Permission.CREATE_ROLES));
  const { isOpen, onOpen, onClose } = useDisclosure();

  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');

  if (!canCreateRoles) return null;

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        px="1.5rem"
        disabled={isLoadingRoles}
      >
        Nuevo
      </Button>

      {/* Solo renderizar el formulario cuando el modal está abierto */}
      {isOpen && <RoleAddModal isOpen={isOpen} onClose={onClose} setRoles={setRoles} />}
    </>
  );
};
