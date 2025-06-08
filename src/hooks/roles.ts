import { useEffect, useState } from 'react';
import { get, put, post, del } from '@/utils/fetcher';
import { Result } from './result';
import { Role } from '@/entities/role';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getRoles = (): Promise<Role[]> => {
  return get<Role[]>(`${API_URL}/Roles`, true);
};

export const useGetRoles = (): Result<Role[]> => {
  const [data, setData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getRoles();
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

const addRole = (Role: Partial<Role>): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Roles`, Role, true);
};

export const useAddRole = (props?: Partial<Role>): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addRole(props);
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

const deleteRole = (id: number): Promise<boolean> => {
  return del<boolean>(`${API_URL}/Roles`, { id }, true);
};

export const useDeleteRole = (id?: number): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await deleteRole(id);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [id]);

  return { data, isLoading, error };
};

export const updateRole = (Role: Role): Promise<Result<boolean>> => {
  return put<Result<boolean>>(`${API_URL}/Roles`, Role, true);
};

export const useUpdateRole = (props?: Role): Result<boolean> => {
  const [data, setData] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!props) return;

    const fetchData = async () => {
      setIsLoading(true);
      const result = await updateRole(props);
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
