'use client';

import {
  Button,
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
  Progress,
  Box,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { validate } from '@/utils/validations/validate';
import { ReactNode } from 'react';

type FieldConfig<T> = {
  name: keyof T;
  label: string;
  type: 'text' | 'select' | 'number';
  required?: boolean;
};

type GenericAddModalProps<T> = {
  buttonLabel: string;
  modalTitle: string;
  initialValues: T;
  fields: FieldConfig<T>[];
  onSubmit: (values: T) => void;
  isLoading: boolean;
  selectOptions?: { [key in keyof T]?: { label: string; value: string }[] };
  customValidate?: { [key in keyof T]?: (value: any) => string | undefined };
  extraFields?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export const GenericAddModal = <T extends Record<string, any>>({
  buttonLabel,
  modalTitle,
  initialValues,
  fields,
  onSubmit,
  isLoading,
  selectOptions = {},
  customValidate = {},
  extraFields = null,
  isOpen,
  onClose,
  onOpen,
}: GenericAddModalProps<T>) => {
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  return (
    <>
      <Button
        bg={buttonBg}
        _hover={{ bg: buttonHover }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        {buttonLabel}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            {modalTitle}
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <ModalBody pb="0">
                  <VStack spacing="0.75rem">
                    {fields.map((field) => {
                      const isInvalid =
                        (submitCount > 0 || touched[field.name as string]) && !!errors[field.name as string];

                      const validateFn = customValidate[field.name] ?? (field.required ? validate : undefined);

                      return (
                        <FormControl key={field.name as string} isInvalid={isInvalid}>
                          <FormLabel>
                            {field.label}{' '}
                            {field.required && (
                              <Box as="span" color="red.500">
                                *
                              </Box>
                            )}
                          </FormLabel>

                          {field.type === 'select' ? (
                            <Field
                              as={Select}
                              name={field.name as string}
                              placeholder="Seleccione una opción..."
                              bg={inputBg}
                              borderColor={inputBorder}
                              h="2.75rem"
                              fontSize="0.875rem"
                              validate={validateFn}
                            >
                              {selectOptions[field.name]?.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                          ) : (
                            <Field
                              as={Input}
                              type={field.type}
                              name={field.name as string}
                              bg={inputBg}
                              borderColor={inputBorder}
                              h="2.75rem"
                              validate={validateFn}
                            />
                          )}

                          <FormErrorMessage>{(errors as any)[field.name]}</FormErrorMessage>
                        </FormControl>
                      );
                    })}
                    {extraFields}
                  </VStack>
                </ModalBody>

                <ModalFooter pb="1.5rem">
                  <Box mt="0.5rem" w="100%">
                    <Progress
                      h={isLoading ? '4px' : '1px'}
                      mb="1.5rem"
                      size="xs"
                      isIndeterminate={isLoading}
                      colorScheme="blue"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      bg={submitBg}
                      color="white"
                      _hover={{ backgroundColor: submitHover }}
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
        </ModalContent>
      </Modal>
    </>
  );
};
