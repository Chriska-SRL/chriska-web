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
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FiCode } from 'react-icons/fi';
import { Formik, Field } from 'formik';
import { useEffect, useState } from 'react';
import { useLogin } from '@/hooks/login';
import { useUserStore } from '@/stores/useUserStore';
import { Login as LoginValues } from '@/entities/login';
import { useRouter } from 'next/navigation';

export const Login = () => {
  const router = useRouter();
  const toast = useToast();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { performLogin, performDevLogin, isLoading, error, fieldError } = useLogin();
  const setTempPassword = useUserStore((state) => state.setTempPassword);

  const bg = useColorModeValue('gray.100', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('black', 'white');
  const btnBg = useColorModeValue('brand.500', 'brand.500');
  const btnHover = useColorModeValue('brand.700', 'brand.700');
  const devBtnBg = useColorModeValue('orange.500', 'orange.500');
  const devBtnHover = useColorModeValue('orange.600', 'orange.600');

  useEffect(() => {
    if (error || fieldError) {
      toast.closeAll();
      toast({
        title: 'Error de inicio de sesión',
        description: fieldError?.error || error || 'Ha ocurrido un error inesperado.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [error, fieldError, toast]);

  const handleLoginSuccess = () => {
    const user = useUserStore.getState().user;
    setIsRedirecting(true);

    // Mostrar toast de éxito pero no bloquear la redirección
    toast({
      title: 'Inicio de sesión exitoso',
      description: 'Redirigiendo...',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });

    // Redirección inmediata y robusta
    try {
      if (typeof window !== 'undefined') {
        const redirectUrl = user?.needsPasswordChange ? '/cambiar-contrasena' : '/';
        window.location.replace(redirectUrl);
      } else {
        // Fallback para SSR
        if (user?.needsPasswordChange) {
          router.push('/cambiar-contrasena');
        } else {
          router.push('/');
        }
      }
    } catch (error) {
      console.error('Error during login redirect:', error);
      // Fallback en caso de error
      if (user?.needsPasswordChange) {
        router.push('/cambiar-contrasena');
      } else {
        router.push('/');
      }
    } finally {
      // Este finally puede no ejecutarse debido a window.location.replace
      // pero está aquí como precaución
      setIsRedirecting(false);
    }
  };

  const handleSubmit = async (values: LoginValues) => {
    const success = await performLogin(values.username, values.password);

    if (success) {
      setTempPassword(values.password);
      handleLoginSuccess();
    }
  };

  const handleDevLogin = async () => {
    const success = await performDevLogin();

    if (success) {
      setTempPassword('');
      handleLoginSuccess();
    }
  };

  return (
    <Flex height="100dvh" bg={bg} justifyContent="center" alignItems="center">
      <Container maxW={{ base: '90dvw', sm: '25rem' }}>
        <Text fontSize="1.875rem" fontWeight="bold" color={titleColor} textAlign="center" pb="1rem">
          Chriska S.R.L.
        </Text>
        <Box bg={boxBg} boxShadow="lg" borderRadius="0.5rem" p="2rem">
          <Formik
            initialValues={{ username: '', password: '' }}
            onSubmit={handleSubmit}
            validate={(values) => {
              const errors: Partial<LoginValues> = {};
              if (!values.username || values.username.trim().length < 3) {
                errors.username = 'Debe ingresar un nombre de usuario válido';
              } else if (/\s/.test(values.username)) {
                errors.username = 'El nombre de usuario no debe contener espacios';
              } else if (!/^[a-zA-Z.]+$/.test(values.username)) {
                errors.username = 'Solo se permiten letras y puntos (.)';
              }
              if (!values.password) {
                errors.password = 'Debe ingresar la contraseña';
              }
              return errors;
            }}
            validateOnChange
            validateOnBlur={false}
          >
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <FormControl mb="1rem" isInvalid={submitCount > 0 && touched.username && !!errors.username}>
                  <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
                  <Field
                    as={Input}
                    id="username"
                    name="username"
                    type="text"
                    variant="filled"
                    disabled={isLoading || isRedirecting}
                    autoCapitalize="none"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>

                <FormControl mb="1rem" isInvalid={submitCount > 0 && touched.password && !!errors.password}>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    disabled={isLoading || isRedirecting}
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Box mt="1.5rem">
                  <Progress
                    h={isLoading || isRedirecting ? '4px' : '1px'}
                    mb="1.5rem"
                    size="xs"
                    isIndeterminate={isLoading || isRedirecting}
                    colorScheme={isRedirecting ? 'green' : 'blue'}
                  />
                  <HStack spacing="0.5rem">
                    <Button
                      type="submit"
                      isDisabled={isLoading || isRedirecting}
                      bg={btnBg}
                      color="white"
                      _hover={{ backgroundColor: btnHover }}
                      flex="1"
                      opacity={isRedirecting ? 0.8 : 1}
                    >
                      {isRedirecting ? 'Redirigiendo...' : isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </Button>

                    <IconButton
                      onClick={handleDevLogin}
                      isDisabled={isLoading || isRedirecting}
                      bg={devBtnBg}
                      color="white"
                      _hover={{ backgroundColor: devBtnHover }}
                      icon={<FiCode />}
                      aria-label="Login de desarrollo"
                      size="md"
                      opacity={isRedirecting ? 0.8 : 1}
                    />
                  </HStack>
                </Box>
              </form>
            )}
          </Formik>
        </Box>
      </Container>
    </Flex>
  );
};
