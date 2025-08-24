import { PasswordReset } from '@/entities/password-reset/password-reset';
import { PasswordResetResponse } from '@/entities/password-reset/password-reset-response';
import { User } from '@/entities/user';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UserFilters = {
  name?: string;
  roleId?: number;
  isEnabled?: boolean;
};

export const getUsers = (page: number = 1, pageSize: number = 10, filters?: UserFilters): Promise<User[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  if (filters?.roleId) {
    params.append('filters[RoleId]', filters.roleId.toString());
  }

  if (filters?.isEnabled !== undefined) {
    params.append('filters[IsEnabled]', filters.isEnabled ? 'T' : 'F');
  }

  return get<User[]>(`${API_URL}/Users?${params.toString()}`);
};

export const addUser = (user: Partial<User>): Promise<User> => {
  return post<User>(`${API_URL}/Users`, user);
};

export const updateUser = (user: Partial<User>): Promise<User> => {
  return put<User>(`${API_URL}/Users/${user.id}`, user);
};

export const deleteUser = (id: number): Promise<User> => {
  return del<User>(`${API_URL}/Users/${id}`);
};

export const temporaryPassword = (userId: number): Promise<PasswordResetResponse> => {
  return post<PasswordResetResponse>(`${API_URL}/Users/resetpassword`, { userId });
};

export const passwordReset = (passwordReset: PasswordReset): Promise<PasswordResetResponse> => {
  return post<PasswordResetResponse>(`${API_URL}/Users/resetmypassword`, passwordReset);
};
