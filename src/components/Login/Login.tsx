'use client';

import {
  Box,
  Container,
  Button,
  Text,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Flex,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { Formik, Field } from 'formik';
import { useState, useEffect } from 'react';
import { useLogin } from '@/hooks/login';
import { useRouter } from 'next/navigation';
import { Login as LoginValues } from '@/entities/login';
import { useUserStore } from '@/stores/useUserStore';
import { validate } from '@/utils/validate';

const _containerW = { sm: '25rem', base: '20rem' };

export const Login = () => {
  const router = useRouter();
  const toast = useToast();
  const [loginProps, setLoginProps] = useState<LoginValues>();
  const { data, isLoading, error, fieldError } = useLogin(loginProps);
  const setUserFromToken = useUserStore((state) => state.setUserFromToken);
  const user = useUserStore((state) => state.user);

  const bg = useColorModeValue('gray.100', 'gray.900');
  const boxBg = useColorModeValue('white', 'gray.800');
  const titleColor = useColorModeValue('black', 'white');
  const btnBg = useColorModeValue('brand.500', 'brand.500');
  const btnHover = useColorModeValue('brand.700', 'brand.700');

  useEffect(() => {
    if (data) {
      const token = localStorage.getItem('access_token');
      if (token) {
        setUserFromToken(token);
      }
    }
  }, [data]);

  useEffect(() => {
    if (user) {
      if (user.needsPasswordChange) {
        router.push('/cambiar-contrasena');
      } else {
        router.push('/');
      }
    }
  }, [user]);

  useEffect(() => {
    if (error || fieldError) {
      toast.closeAll();

      if (error) {
        toast({
          title: 'Error de inicio de sesión',
          description: error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else if (fieldError) {
        toast({
          title: 'Error',
          description: fieldError.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [error, fieldError]);

  const initialValues: LoginValues = {
    username: '',
    password: '',
  };

  const handleSubmit = (values: LoginValues) => {
    setLoginProps(values);
  };

  return (
    <Flex height="100vh" bg={bg} justifyContent="center" alignItems="center">
      <Container maxW={_containerW}>
        <Text fontSize="1.875rem" fontWeight="bold" color={titleColor} textAlign="center" pb="1rem">
          Chriska S.R.L.
        </Text>
        <Box bg={boxBg} boxShadow="lg" borderRadius="0.5rem" p="2rem">
          <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange validateOnBlur={false}>
            {({ handleSubmit, errors, touched, submitCount }) => (
              <form onSubmit={handleSubmit}>
                <FormControl mb="1rem" isInvalid={submitCount > 0 && touched.username && !!errors.username}>
                  <FormLabel htmlFor="username">Nombre de usuario</FormLabel>
                  <Field as={Input} id="username" name="username" type="text" variant="filled" validate={validate} />
                </FormControl>

                <FormControl mb="0.5rem" isInvalid={submitCount > 0 && touched.password && !!errors.password}>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    validate={validate}
                  />
                </FormControl>

                {submitCount > 0 && Object.keys(errors).length > 0 && (
                  <Text color="red.500" fontSize="0.875rem" textAlign="left" pt="0.375rem">
                    Debe completar todos los campos
                  </Text>
                )}

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
                    disabled={isLoading}
                    bg={btnBg}
                    color="white"
                    _hover={{ backgroundColor: btnHover }}
                    width="100%"
                  >
                    Iniciar sesión
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
