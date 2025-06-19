'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  FormErrorMessage,
  Progress,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';

export type FieldConfig<T> = {
  name: keyof T;
  label: string;
  validate?: (value: any) => string | undefined;
};

type GenericEditProps<T> = {
  item: T;
  fields: FieldConfig<T>[];
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  error?: { field?: string; error: string };
  onSubmit: (values: Partial<T>, onSuccess: () => void) => void;
};

export const GenericEdit = <T extends Record<string, any>>({
  item,
  fields,
  isOpen,
  onClose,
  isLoading,
  error,
  onSubmit,
}: GenericEditProps<T>) => {
  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = item[field.name];
    return acc;
  }, {} as Partial<T>);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Editar</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => onSubmit(values, handleSuccess)}
          enableReinitialize
          validateOnChange
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="2rem">
                <VStack spacing="1rem" align="stretch">
                  {fields.map((field) => (
                    <FormControl
                      key={String(field.name)}
                      isInvalid={
                        submitCount > 0 &&
                        touched[field.name as string] &&
                        !!errors[field.name as string]
                      }
                    >
                      <FormLabel>{field.label}</FormLabel>
                      <Field
                        as={Input}
                        name={String(field.name)}
                        bg={inputBg}
                        borderColor={inputBorder}
                        validate={field.validate}
                      />
                      <FormErrorMessage>
                        {errors[field.name as string] as string}
                      </FormErrorMessage>
                    </FormControl>
                  ))}

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
                    bg={submitBg}
                    color="white"
                    _hover={{ backgroundColor: submitHover }}
                    w="100%"
                    leftIcon={<span style={{ display: 'inline-block', transform: 'scale(0.9)' }}>✔</span>}
                    py="1.375rem"
                  >
                    Confirmar
                  </Button>
                </VStack>
              </ModalBody>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
