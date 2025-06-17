import { useEffect, useState } from 'react';
import { login } from '@/services/login';
import { Login } from '@/entities/login';
import { Result, FieldError } from './result';

export const useLogin = (props?: Login): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (!props) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);
      setFieldError(undefined);

      try {
        const result = await login(props.username, props.password);
        localStorage.setItem('access_token', result.token);
        setData(true);
      } catch (err: any) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.campo && parsed?.error) {
            setFieldError(parsed);
          } else if (parsed?.error) {
            setError(parsed.error);
          } else {
            setError(err.message || 'Error desconocido');
          }
        } catch {
          setError(err.message || 'Error desconocido');
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [props?.username, props?.password]);

  return { data, isLoading, error, fieldError };
};
