import { useEffect, useState } from 'react';
import { post } from '@/utils/fetcher';
import { Result } from './result';
import { AccessToken } from '@/entities/access-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LoginProps = {
  username: string;
  password: string;
};

const login = (username: string, password: string): Promise<AccessToken> => {
  return post<AccessToken>(`${API_URL}/Auth/login`, { username, password });
};

export const useLogin = (props?: LoginProps): Result<boolean> => {
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
