import { useEffect, useState } from 'react';
import { get, put, post } from '@/utils/fetcher';
import { Result } from './result';
import { User } from '@/entities/user/user';
import { AddUser } from '@/entities/user/add-user';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getUsers = async (): Promise<User[]> => {
  return get<User[]>(`${API_URL}/Users`, true);
};

const addUser = (user: AddUser): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Users`, user, true);
};

export const useAddUser = (props?: AddUser): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addUser(props);
          setData(result);
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

export const updateUser = (user: User): Promise<Result<boolean>> => {
  return put<Result<boolean>>(`${API_URL}/users`, { body: JSON.stringify(user) }, true);
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
