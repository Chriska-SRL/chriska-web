import { useEffect, useState } from 'react';
import { get, put } from '@/utils/fetcher';
import { Result } from './result';
import { User } from '@/entities/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getUsers = async (): Promise<User[]> => {
  return get<User[]>(`${API_URL}/Users`, true);
};

export const useGetUsers = (): Result<User[]> => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getUsers();
        setData(result);
        setError(undefined);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
        setData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

export const updateUser = (person: User): Promise<Result<boolean>> => {
  return put<Result<boolean>>(`${API_URL}/users`, { body: JSON.stringify(person) }, true);
};

export const useUpdateUser = (props?: User): Result<boolean> => {
  const [data, setData] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!props) return;

    const fetchData = async () => {
      setIsLoading(true);
      const result = await updateUser(props);
      if (result.error) {
        setError(result.error);
        setData(undefined);
      } else {
        setData(true);
        setError(undefined);
      }
      setIsLoading(false);
    };

    fetchData();

    return () => {
      setData(undefined);
      setError(undefined);
    };
  }, [props]);

  return { data, isLoading, error };
};
