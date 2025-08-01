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

export const PasswordReset = () => {
  const router = useRouter();
  const toast = useToast();

  const user = useUserStore((state) => state.user);
  const tempPassword = useUserStore((state) => state.tempPassword);
  const clearTempPassword = useUserStore((state) => state.clearTempPassword);
  const logout = useUserStore((state) => state.logout);

  const [resetProps, setResetProps] = useState<ResetPassword>();
  const { data, isLoading, error, fieldError } = usePasswordReset(resetProps);

  const bg = useColorModeValue('gray.100', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('black', 'white');
  const btnBg = useColorModeValue('brand.500', 'brand.500');
  const btnHover = useColorModeValue('brand.700', 'brand.700');

  useEffect(() => {
    if (data) {
      clearTempPassword();
      logout();

      toast({
        title: 'Contraseña actualizada correctamente',
        description: 'Redirigiendo al inicio de sesión...',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });

      // Refresh and navigate to let middleware handle the redirection
      router.refresh();
      router.push('/iniciar-sesion');
    }
  }, [data, clearTempPassword, logout, toast]);

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
  }, [error, fieldError, toast]);

  const handleSubmit = (values: { newPassword: string; confirmPassword: string }) => {
    if (!user?.userId || !tempPassword) {
      toast({
        title: 'Error interno',
        description: 'Ocurrió un error inesperado. Intente iniciar sesión nuevamente.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      logout();
      router.refresh();
      router.push('/iniciar-sesion');
      return;
    }

    setResetProps({
      username: user.username,
      oldPassword: tempPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <Flex height="100dvh" bg={bg} justifyContent="center" alignItems="center">
      <Container maxW={{ base: '90dvw', sm: '25rem' }}>
        <Text fontSize="1.875rem" fontWeight="bold" color={titleColor} textAlign="center" pb="0.125rem">
          Cambiar contraseña
        </Text>
        <Text fontSize="0.875rem" color={titleColor} textAlign="center" pb="1rem" opacity={0.7}>
          Como es tu primer inicio de sesión, debes cambiar tu contraseña
        </Text>
        <Box bg={boxBg} boxShadow="lg" borderRadius="0.5rem" p="2rem">
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: Partial<{ newPassword: string; confirmPassword: string }> = {};
              if (!values.newPassword || values.newPassword.length < 8)
                errors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
              if (!values.confirmPassword) errors.confirmPassword = 'Debe confirmar la contraseña';
              else if (values.newPassword !== values.confirmPassword)
                errors.confirmPassword = 'Las contraseñas no coinciden';
              return errors;
            }}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <FormControl mb="1rem" isInvalid={submitCount > 0 && touched.newPassword && !!errors.newPassword}>
                  <FormLabel htmlFor="newPassword">Nueva contraseña</FormLabel>
                  <Field as={Input} name="newPassword" type="password" variant="filled" disabled={isLoading} />
                  <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
                </FormControl>

                <FormControl
                  mb="1rem"
                  isInvalid={submitCount > 0 && touched.confirmPassword && !!errors.confirmPassword}
                >
                  <FormLabel htmlFor="confirmPassword">Confirmar contraseña</FormLabel>
                  <Field as={Input} name="confirmPassword" type="password" variant="filled" disabled={isLoading} />
                  <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
                </FormControl>

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
                    {isLoading ? 'Guardando contraseña...' : 'Guardar nueva contraseña'}
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
