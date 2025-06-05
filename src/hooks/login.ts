import { useEffect, useState } from 'react';
import { post } from '@/utils/fetcher';
import { Result } from './result';
import { User } from '@/entities/user';
import { AccessToken } from '@/entities/access-token';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type LoginProps = {
  username: string;
  password: string;
};

// const login = (username: string, password: string): Promise<AccessToken> => {
//   console.log('parametros', username, password);
//   const body = JSON.stringify({ username, password });
//   console.log('body', body);
//   return post<AccessToken>(`${API_URL}/Auth/login`, { body: body });
// };

// const login = (username: string, password: string): Promise<AccessToken> => {
//   return post<AccessToken>(`${API_URL}/Auth/login`, { body: JSON.stringify({ username, password }) });
// };

const login = (username: string, password: string): Promise<AccessToken> => {
  return post<AccessToken>(`${API_URL}/Auth/login`, { username, password });
};

export const useLogin = (props?: LoginProps): Result<boolean> => {
  //   const [accessTokenResult, setAccessTokenResult] = useState<AccessToken>();
  const [isLoading, setIsLoading] = useState(false);
  //   const [user, setUser] = useState<User>();
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
          //   setAccessTokenResult(result);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [props]);

  //   useEffect(() => {
  //     if (accessTokenResult) {
  //       const fetchData = async () => {
  //         if (accessTokenResult) {
  //           const result = await getUser(accessTokenResult);

  //           if (result.error) {
  //             setError(result.error);
  //           } else {
  //             localStorage.setItem('user', result);
  //             setUser(result);
  //           }
  //           setIsLoading(false);
  //         }
  //       };

  //       fetchData();
  //     }
  //   }, [accessTokenResult]);

  return { data, isLoading, error };
};
