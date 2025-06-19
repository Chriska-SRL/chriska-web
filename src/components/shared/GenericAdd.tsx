'use client';

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  Progress,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaCheck, FaPlus } from 'react-icons/fa';

export type FieldConfig<T> = {
  name: keyof T;
  label: string;
  validate?: (value: any) => string | undefined;
};

type GenericAddProps<T> = {
  fields: FieldConfig<T>[];
  buttonLabel: string;
  onSubmit: (values: Partial<T>, onSuccess: () => void) => void;
  isLoading: boolean;
};

export const GenericAdd = <T extends Record<string, any>>({
  fields,
  buttonLabel,
  onSubmit,
  isLoading,
}: GenericAddProps<T>) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = '' as T[keyof T];
    return acc;
  }, {} as Partial<T>);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <>
      <Button
        bg="gray.100"
        _hover={{ bg: 'gray.200' }}
        leftIcon={<FaPlus />}
        onClick={onOpen}
        w={{ base: '100%', md: 'auto' }}
        px="1.5rem"
      >
        {buttonLabel}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">{buttonLabel}</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => onSubmit(values, handleSuccess)}
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
                      leftIcon={<FaCheck />}
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
    </>
  );
};
