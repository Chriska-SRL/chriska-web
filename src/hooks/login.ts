import { useEffect, useState } from 'react';
import { Result } from './result';
import { login } from '@/services/login';
import { Login } from '@/entities/login';

export const useLogin = (props?: Login): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await login(props.username, props.password);
          localStorage.setItem('access_token', result.token);
          setData(true);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [props]);

  return { data, isLoading, error };
};
