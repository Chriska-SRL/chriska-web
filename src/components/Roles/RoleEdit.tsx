'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { PERMISSIONS_METADATA } from '@/entities/permissions/permissionMetadata';
import { Role } from '@/entities/role';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
  onSave: (updatedRole: Role) => void;
};

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

export const RoleEdit = ({ isOpen, onClose, role, onSave }: Props) => {
  const initialValues = role
    ? {
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      }
    : {
        name: '',
        description: '',
        permissions: [] as number[],
      };

  const groupedPermissions = PERMISSIONS_METADATA.reduce(
    (acc, perm) => {
      if (!acc[perm.group]) acc[perm.group] = [];
      acc[perm.group].push(perm);
      return acc;
    },
    {} as Record<string, typeof PERMISSIONS_METADATA>,
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar rol
        </ModalHeader>
        {role && (
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => onSave({ ...role, ...values })}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, values, setFieldValue, errors, touched, submitCount, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="1rem">
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
                        minH="6rem"
                        validate={validateEmpty}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Permisos</FormLabel>
                      <Accordion allowMultiple defaultIndex={[0]}>
                        {Object.entries(groupedPermissions).map(([group, perms]) => (
                          <AccordionItem key={group}>
                            <h2>
                              <AccordionButton>
                                <Box flex="1" textAlign="left" fontWeight="semibold">
                                  {group}
                                </Box>
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

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
                    <Progress
                      h={isSubmitting ? '4px' : '1px'}
                      mb="1.5rem"
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
                    >
                      Confirmar
                    </Button>
                  </Box>
                </ModalFooter>
              </form>
            )}
          </Formik>
        )}
      </ModalContent>
    </Modal>
  );
};
