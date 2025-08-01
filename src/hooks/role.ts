import { useState, useEffect } from 'react';
import { Role } from '@/entities/role';
import { addRole, deleteRole, getRoles, updateRole } from '@/services/role';
import { useFetch } from '@/utils/useFetch';

export const useGetRoles = (page: number = 1, pageSize: number = 10, filterName?: string) => {
  const [data, setData] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getRoles(page, pageSize, filterName);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [page, pageSize, filterName]);

  return { data, isLoading, error };
};

export const useAddRole = (props?: Partial<Role>) =>
  useFetch<Partial<Role>, Role>(addRole, props, { parseFieldError: true });

export const useUpdateRole = (props?: Partial<Role>) =>
  useFetch<Partial<Role>, Role>(updateRole, props, { parseFieldError: true });

export const useDeleteRole = (id?: number) => useFetch<number, Role>(deleteRole, id);
