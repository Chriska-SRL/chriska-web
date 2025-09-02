import { useState, useEffect, useMemo } from 'react';
import { User } from '@/entities/user';
import { getUsers, addUser, updateUser, deleteUser, passwordReset, temporaryPassword } from '@/services/user';
import { PasswordReset } from '@/entities/password-reset/password-reset';
import { useFetch, useMutation } from '../utils/useFetch';
import { PasswordResetResponse } from '@/entities/password-reset/password-reset-response';

type UserFilters = {
  name?: string;
  roleId?: number;
  isEnabled?: boolean;
};

export const useGetUsers = (page: number = 1, pageSize: number = 10, filters?: UserFilters) => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters?.name, filters?.roleId, filters?.isEnabled]);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getUsers(page, pageSize, memoizedFilters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useAddUser = () => useMutation<Partial<User>, User>(addUser, { parseFieldError: true });

export const useUpdateUser = () => useMutation<Partial<User>, User>(updateUser, { parseFieldError: true });

export const useDeleteUser = (id?: number) => useFetch<number, User>(deleteUser, id);

export const useTemporaryPassword = (userId?: number) =>
  useFetch<number, PasswordResetResponse>(temporaryPassword, userId);

export const usePasswordReset = (props?: PasswordReset) =>
  useFetch<PasswordReset, PasswordResetResponse>(passwordReset, props, { parseFieldError: true });
