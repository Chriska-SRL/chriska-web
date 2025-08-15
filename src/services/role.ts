import { Role } from '@/entities/role';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getRoles = (page: number = 1, pageSize: number = 10, filterName?: string): Promise<Role[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filterName) {
    params.append('filters[Name]', filterName);
  }

  return get<Role[]>(`${API_URL}/Roles?${params.toString()}`);
};

export const addRole = (role: Partial<Role>): Promise<Role> => {
  return post<Role>(`${API_URL}/Roles`, role);
};

export const updateRole = (role: Partial<Role>): Promise<Role> => {
  return put<Role>(`${API_URL}/Roles/${role.id}`, role);
};

export const deleteRole = (id: number): Promise<Role> => {
  return del<Role>(`${API_URL}/Roles/${id}`);
};
