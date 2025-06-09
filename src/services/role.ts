import { Role } from '@/entities/role';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRoles = (): Promise<Role[]> => {
  return get<Role[]>(`${API_URL}/Roles`, true);
};

export const addRole = (role: Partial<Role>): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Roles`, role, true);
};

export const updateRole = (role: Role): Promise<boolean> => {
  return put<boolean>(`${API_URL}/Roles`, role, true);
};

export const deleteRole = (id: number): Promise<boolean> => {
  return del<boolean>(`${API_URL}/Roles`, { id }, true);
};
