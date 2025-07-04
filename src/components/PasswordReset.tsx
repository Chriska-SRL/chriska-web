'use client';

import {
  Box,
  Container,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Progress,
  Flex,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/useUserStore';
import { usePasswordReset } from '@/hooks/user';
import { PasswordReset as ResetPassword } from '@/entities/password-reset/password-reset';

type FormValues = {
  password: string;
  confirmPassword: string;
};

export const PasswordReset = () => {
  const router = useRouter();
  const toast = useToast();
  const user = useUserStore((state) => state.user);
  const [resetProps, setResetProps] = useState<ResetPassword>();
  const { data, isLoading, error, fieldError } = usePasswordReset(resetProps);

  const bg = useColorModeValue('gray.100', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('black', 'white');
  const btnBg = useColorModeValue('brand.500', 'brand.500');
  const btnHover = useColorModeValue('brand.700', 'brand.700');

  useEffect(() => {
    if (data) {
      toast({
        title: 'Contraseña actualizada',
        description: 'La contraseña se ha cambiado correctamente',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      router.push('/');
    }
  }, [data]);

  useEffect(() => {
    if (error || fieldError) {
      toast.closeAll();
      toast({
        title: 'Error al cambiar la contraseña',
        description:
          fieldError?.campo && fieldError?.error
            ? `${fieldError.campo}: ${fieldError.error}`
            : error || 'Ha ocurrido un error inesperado.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  }, [error, fieldError]);

  const handleSubmit = (values: FormValues) => {
    if (!user?.userId) {
      toast({
        title: 'Error interno',
        description: 'No se pudo identificar al usuario. Intente iniciar sesión nuevamente.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setResetProps({
      userId: user.userId,
      newPassword: values.password,
    });
  };

  return (
    <Flex height="100vh" bg={bg} justifyContent="center" alignItems="center">
      <Container maxW={{ sm: '25rem', base: '20rem' }}>
        <Text fontSize="1.875rem" fontWeight="bold" color={titleColor} textAlign="center" pb="1rem">
          Cambiar contraseña
        </Text>
        <Box bg={boxBg} boxShadow="lg" borderRadius="0.5rem" p="2rem">
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: Partial<FormValues> = {};
              if (!values.password || values.password.length < 8)
                errors.password = 'La contraseña debe tener al menos 8 caracteres';
              if (!values.confirmPassword) errors.confirmPassword = 'Debe confirmar la contraseña';
              else if (values.password !== values.confirmPassword)
                errors.confirmPassword = 'Las contraseñas no coinciden';
              return errors;
            }}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <FormControl mb="1rem" isInvalid={submitCount > 0 && touched.password && !!errors.password} isRequired>
                  <FormLabel htmlFor="password">Nueva contraseña</FormLabel>
                  <Field as={Input} id="password" name="password" type="password" variant="filled" />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <FormControl
                  mb="1rem"
                  isInvalid={submitCount > 0 && touched.confirmPassword && !!errors.confirmPassword}
                  isRequired
                >
                  <FormLabel htmlFor="confirmPassword">Confirmar contraseña</FormLabel>
                  <Field as={Input} id="confirmPassword" name="confirmPassword" type="password" variant="filled" />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

                {/* {submitCount > 0 && Object.keys(errors).length > 0 && (
                  <Text color="red.500" fontSize="0.875rem" textAlign="left" pt="0.5rem">
                    Por favor corregí los errores antes de continuar.
                  </Text>
                )} */}

                <Box mt="1.5rem">
                  <Progress
                    h={isLoading ? '4px' : '1px'}
                    mb="1.5rem"
                    size="xs"
                    isIndeterminate={isLoading}
                    colorScheme="blue"
                  />
                  <Button
                    type="submit"
                    isDisabled={isLoading}
                    bg={btnBg}
                    color="white"
                    _hover={{ backgroundColor: btnHover }}
                    width="100%"
                  >
                    Guardar nueva contraseña
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Container>
    </Flex>
  );
};
