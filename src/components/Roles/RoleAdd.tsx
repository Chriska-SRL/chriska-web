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
  useToast,
  VStack,
  Progress,
  Box,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

export const RoleAdd = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [formData, setFormData] = useState<any>();

  useEffect(() => {
    if (formData) {
      toast({
        title: 'Rol creado',
        description: `${formData.name} ha sido creado correctamente.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      formData?.resetForm?.();
      setFormData(undefined);
      onClose();
    }
  }, [formData, toast, onClose]);

  const handleSubmit = (values: any, { resetForm }: { resetForm: () => void }) => {
    setFormData({ ...values, resetForm });
    console.log('Rol creado:', values);
  };

  return (
    <>
      <Button bg="#f2f2f2" _hover={{ bg: '#e0dede' }} leftIcon={<FaPlus />} onClick={onOpen}>
        Crear rol
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Crear rol
          </ModalHeader>
          <Formik
            initialValues={{ name: '', description: '' }}
            onSubmit={handleSubmit}
            validateOnChange={true}
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount, isSubmitting }) => (
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
                        type="text"
                        bg="#f5f5f7"
                        borderColor="#f5f5f7"
                        fontSize="0.875rem"
                        h="2.75rem"
                        validate={validateEmpty}
                      />
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
        </ModalContent>
      </Modal>
    </>
  );
};
