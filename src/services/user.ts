import { PasswordReset } from '@/entities/password-reset/password-reset';
import { PasswordResetResponse } from '@/entities/password-reset/password-reset-response';
import { TemporaryPasswordResponse } from '@/entities/password-reset/temporary-password-response';
import { User } from '@/entities/user';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = (): Promise<User[]> => {
  return get<User[]>(`${API_URL}/Users`, true);
};

export const addUser = (user: Partial<User>): Promise<User> => {
  return post<User>(`${API_URL}/Users`, user, true);
};

export const updateUser = (user: Partial<User>): Promise<User> => {
  return put<User>(`${API_URL}/Users`, user, true);
};

export const deleteUser = (id: number): Promise<User> => {
  return del<User>(`${API_URL}/Users/${id}`, true);
};

export const temporaryPassword = (userId: number): Promise<TemporaryPasswordResponse> => {
  return post<TemporaryPasswordResponse>(`${API_URL}/Users/resetpassword`, { userId }, true);
};

export const passwordReset = (passwordReset: PasswordReset): Promise<PasswordResetResponse> => {
  return post<PasswordResetResponse>(`${API_URL}/Users/resetpassword`, passwordReset, true);
};
