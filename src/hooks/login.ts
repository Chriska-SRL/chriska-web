import { useEffect, useState } from 'react';
import { login } from '@/services/login';
import { Login } from '@/entities/login';
import { Result, FieldError } from './result'; // asegurate de tener este tipo

export const useLogin = (props?: Login): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (!props) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await login(props.username, props.password);
        localStorage.setItem('access_token', result.token);
        setData(true);
        setError(undefined);
        setFieldError(undefined);
      } catch (err: any) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.campo && parsed?.error) {
            setFieldError(parsed);
            setError(undefined);
          } else if (parsed?.error) {
            setError(parsed.error);
            setFieldError(undefined);
          } else {
            setError(err.message || 'Error desconocido');
            setFieldError(undefined);
          }
        } catch {
          setError(err.message || 'Error desconocido');
          setFieldError(undefined);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [props?.username, props?.password]);

  return { data, isLoading, error, fieldError };
};
