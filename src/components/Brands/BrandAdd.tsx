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
  Progress,
  Box,
  ModalCloseButton,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { FaPlus, FaCheck } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { Brand } from '@/entities/brand';
import { useAddBrand } from '@/hooks/brand';
import { validate } from '@/utils/validations/validate';
import { Permission } from '@/enums/permission.enum';
import { useUserStore } from '@/stores/useUserStore';

type BrandAddProps = {
  setBrands: React.Dispatch<React.SetStateAction<Brand[]>>;
};

export const BrandAdd = ({ setBrands }: BrandAddProps) => {
  const canCreateBrands = useUserStore((s) => s.hasPermission(Permission.CREATE_PRODUCTS));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [brandProps, setBrandProps] = useState<Partial<Brand>>();
  const { data, isLoading, error, fieldError } = useAddBrand(brandProps);

  const inputBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const inputBorder = useColorModeValue('gray.200', 'whiteAlpha.300');
  const buttonBg = useColorModeValue('#f2f2f2', 'gray.700');
  const buttonHover = useColorModeValue('#e0dede', 'gray.500');
  const submitBg = useColorModeValue('#4C88D8', 'blue.400');
  const submitHover = useColorModeValue('#376bb0', 'blue.600');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Zona creada',
        description: `La marca ha sido creada correctamente.`,
        status: 'success',
        duration: 1500,
        isClosable: true,
      });
      setBrandProps(undefined);
      setBrands((prev) => [...prev, data]);
      onClose();
    }
  }, [data]);

  useEffect(() => {
    if (fieldError) {
      toast({ title: `Error`, description: fieldError.error, status: 'error', duration: 4000, isClosable: true });
    } else if (error) {
      toast({ title: 'Error inesperado', description: error, status: 'error', duration: 3000, isClosable: true });
    }
  }, [error, fieldError]);

  const handleSubmit = (values: Partial<Brand>) => {
    setBrandProps(values);
  };

  return (
    <>
      {canCreateBrands && (
        <Button
          bg={buttonBg}
          _hover={{ bg: buttonHover }}
          leftIcon={<FaPlus />}
          onClick={onOpen}
          w={{ base: '100%', md: 'auto' }}
          px="1.5rem"
        >
          Nuevo
        </Button>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem" pb="0.5rem">
            Nueva marca
          </ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              name: '',
              description: '',
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
                        borderColor={inputBorder}
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
                        borderColor={inputBorder}
                        validate={validate}
                      />
                      <FormErrorMessage>{errors.description}</FormErrorMessage>
                    </FormControl>
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
