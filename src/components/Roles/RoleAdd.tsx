'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Progress,
  Box,
  Text,
  Textarea,
  ModalCloseButton,
  Checkbox,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Role } from '@/entities/role';
import { useAddRole } from '@/hooks/roles';
import { PERMISSIONS_METADATA } from '@/entities/permissions/permissionMetadata';
import { validateEmpty } from '@/utils/validate';

type RoleAddProps = {
  setLocalRoles: React.Dispatch<React.SetStateAction<Role[]>>;
};

export const RoleAdd = ({ setLocalRoles }: RoleAddProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [roleProps, setRoleProps] = useState<Partial<Role>>();
  const { data, isLoading, error, fieldError } = useAddRole(roleProps);

  const buttonBg = useColorModeValue('gray.100', 'gray.600');
  const buttonHoverBg = useColorModeValue('gray.200', 'gray.500');
  const inputBg = useColorModeValue('gray.100', 'gray.700');
  const inputBorder = useColorModeValue('gray.100', 'gray.600');
  const confirmBg = useColorModeValue('#4C88D8', '#4C88D8');
  const confirmHover = useColorModeValue('#376bb0', '#376bb0');
  const textMuted = useColorModeValue('gray.600', 'gray.400');

  const groupedPermissions = PERMISSIONS_METADATA.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof PERMISSIONS_METADATA>,
  );

  useEffect(() => {
    if (data) {
      toast({
        title: 'Rol creado',
        description: `El rol ha sido creado correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setLocalRoles((prev) => [...prev, data]);
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

  const handleSubmit = (values: { name: string; description: string; permissions: number[] }) => {
    const role = {
      name: values.name,
      description: values.description,
      permissions: values.permissions,
    };
    setRoleProps(role);
  };

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHoverBg }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        Crear rol
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'auto', md: '6xl' }} isCentered>
        <ModalOverlay />
        <ModalContent maxH="90vh">
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Crear rol
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{ name: '', description: '', permissions: [] as number[] }}
            onSubmit={handleSubmit}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody px="2rem" pb="2rem" pt="0">
                  <Flex direction={{ base: 'column', md: 'row' }} gap="2rem" align="stretch">
                    <Box flex="1" minW={0}>
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
                                    <Text fontSize="sm" color={textMuted} mr="1rem">
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

                    <Flex flex="1" flexDir="column" minW={0}>
                      <Box>
                        <VStack spacing="1rem" align="stretch">
                          <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                            <FormLabel>Nombre</FormLabel>
                            <Field
                              as={Input}
                              name="name"
                              type="text"
                              bg={inputBg}
                              borderColor={inputBorder}
                              h="2.75rem"
                              validate={validateEmpty}
                              disabled={isLoading}
                            />
                          </FormControl>

                          <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                            <FormLabel>Descripción</FormLabel>
                            <Field
                              as={Textarea}
                              name="description"
                              bg={inputBg}
                              borderColor={inputBorder}
                              resize="vertical"
                              minH="8rem"
                              validate={validateEmpty}
                              disabled={isLoading}
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

                        <Button
                          type="submit"
                          disabled={isLoading}
                          bg={confirmBg}
                          color="white"
                          _hover={{ backgroundColor: confirmHover }}
                          w="100%"
                          leftIcon={<FaCheck />}
                          py="1.375rem"
                        >
                          Confirmar
                        </Button>
                      </Box>
                    </Flex>
                  </Flex>
                </ModalBody>
              </form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};
