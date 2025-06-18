import { User } from '@/entities/user';
import { getUsers, addUser, updateUser, deleteUser, passwordReset, temporaryPassword } from '@/services/user';
import { PasswordReset } from '@/entities/password-reset/password-reset';
import { TemporaryPasswordResponse } from '@/entities/password-reset/temporary-password-response';
import { useFetch, useFetchNoParams } from '../utils/useFetch';
import { PasswordResetResponse } from '@/entities/password-reset/password-reset-response';

export const useGetUsers = () => useFetchNoParams<User[]>(getUsers, []);

export const useAddUser = (props?: Partial<User>) =>
  useFetch<Partial<User>, User>(addUser, props, { parseFieldError: true });

export const useUpdateUser = (props?: Partial<User>) =>
  useFetch<Partial<User>, User>(updateUser, props, { parseFieldError: true });

export const useDeleteUser = (id?: number) => useFetch<number, User>(deleteUser, id);

export const useTemporaryPassword = (userId?: number) =>
  useFetch<number, TemporaryPasswordResponse>(temporaryPassword, userId);

export const usePasswordReset = (props?: PasswordReset) =>
  useFetch<PasswordReset, PasswordResetResponse>(passwordReset, props, { parseFieldError: true });
