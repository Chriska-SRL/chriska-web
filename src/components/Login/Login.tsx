'use client';

import { Formik, Field } from 'formik';
import { Box, Container, Button, Text, FormControl, FormLabel, Input, Progress, Flex } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useLogin } from '@/hooks/login'; // Asegurate de que esté bien la ruta
import { useRouter } from 'next/navigation';

const _backgroundGradient = `linear(to-b, #f2f2f2 50%, transparent 50%)`;
const _containerW = { sm: '25rem', base: '20rem' };

const validateEmpty = (value: string) => (!value ? 'Campo obligatorio' : undefined);

type LoginValues = {
  username: string;
  password: string;
};

export const Login = () => {
  const router = useRouter();
  const [loginProps, setLoginProps] = useState<LoginValues>();
  const { data, error, isLoading } = useLogin(loginProps);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      router.push('/');
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setSubmitError(error);
    }
  }, [error]);

  const initialValues: LoginValues = {
    username: '',
    password: '',
  };

  const handleSubmit = async (values: LoginValues) => {
    setSubmitError(null);
    setLoginProps(values);
  };

  return (
    <Flex height="100vh" bg="white" bgGradient={_backgroundGradient} justifyContent="center" alignItems="center">
      <Container maxW={_containerW}>
        <Text fontSize="1.875rem" fontWeight="bold" color="black" textAlign="center" pb="1rem">
          Chriska S.R.L.
        </Text>
        <Box bg="white" boxShadow="lg" borderRadius="0.5rem" p="2rem">
          <Formik initialValues={initialValues} onSubmit={handleSubmit} validateOnChange validateOnBlur={false}>
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
                    validate={validateEmpty}
                  />
                </FormControl>
                <FormControl mb="0.5rem" isInvalid={submitCount > 0 && touched.password && !!errors.password}>
                  <FormLabel htmlFor="password">Contraseña</FormLabel>
                  <Field
                    as={Input}
                    id="password"
                    name="password"
                    type="password"
                    variant="filled"
                    validate={validateEmpty}
                  />
                </FormControl>

                {submitCount > 0 && Object.keys(errors).length > 0 && (
                  <Text color="red.500" fontSize="0.875rem" textAlign="left" pt="0.375rem">
                    Debe completar todos los campos
                  </Text>
                )}

                {submitError && (
                  <Text color="red.500" fontSize="0.875rem" textAlign="left" mt="0.5rem">
                    {submitError}
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
                    isLoading={isLoading}
                    bg="#4C88D8"
                    color="white"
                    _hover={{ backgroundColor: '#376bb0' }}
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
