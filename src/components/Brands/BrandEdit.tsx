'use client';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Button,
  Progress,
  Box,
  useToast,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Brand } from '@/entities/brand';
import { Formik, Field } from 'formik';
import { FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useUpdateBrand } from '@/hooks/brand';
import { validate } from '@/utils/validations/validate';
import { validateEmpty } from '@/utils/validations/validateEmpty';

type BrandEditProps = {
  isOpen: boolean;
  onClose: () => void;
  brand: Brand | null;
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
};

export const BrandEdit = ({ isOpen, onClose, brand, setBrands }: BrandEditProps) => {
  const toast = useToast();

  const [brandProps, setBrandProps] = useState<Partial<Brand>>();
  const { data, isLoading, error, fieldError } = useUpdateBrand(brandProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Zona actualizada',
        description: 'La marca ha sido actualizada correctamente.',
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setBrands((prevBrands) => prevBrands.map((z) => (z.id === data.id ? { ...z, ...data } : z)));
      setBrandProps(undefined);
      onClose();
    }
  }, [data]);

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
  }, [error, fieldError]);

  const handleSubmit = (values: Brand) => {
    setBrandProps(values);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'sm' }} isCentered>
      <ModalOverlay />
      <ModalContent mx="auto" borderRadius="lg">
        <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
          Editar marca
        </ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{
            id: brand?.id ?? 0,
            name: brand?.name ?? '',
            description: brand?.description ?? '',
          }}
          onSubmit={handleSubmit}
          validateOnChange
          validateOnBlur={false}
        >
          {({ handleSubmit, errors, touched, submitCount }) => (
            <form onSubmit={handleSubmit}>
              <ModalBody pb="0">
                <VStack spacing="0.75rem">
                  <FormControl isInvalid={submitCount > 0 && touched.name && !!errors.name}>
                    <FormLabel>Nombre</FormLabel>
                    <Field
                      as={Input}
                      name="name"
                      bg={inputBg}
                      borderColor={borderColor}
                      h="2.75rem"
                      validate={validate}
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={submitCount > 0 && touched.description && !!errors.description}>
                    <FormLabel>Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      name="description"
                      bg={inputBg}
                      borderColor={borderColor}
                      validate={validateEmpty}
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter pb="1.5rem">
                <Box mt="0.25rem" w="100%">
                  <Progress
                    h={isLoading ? '4px' : '1px'}
                    mb="1.25rem"
                    size="xs"
                    isIndeterminate={isLoading}
                    colorScheme="blue"
                  />
                  <Button
                    type="submit"
                    bg="#4C88D8"
                    color="white"
                    disabled={isLoading}
                    _hover={{ backgroundColor: '#376bb0' }}
                    width="100%"
                    leftIcon={<FaCheck />}
                    fontSize="1rem"
                  >
                    Guardar cambios
                  </Button>
                </Box>
              </ModalFooter>
            </form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
