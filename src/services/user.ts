import { User } from '@/entities/user';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUsers = (): Promise<User[]> => {
  return get<User[]>(`${API_URL}/Users`, true);
};

export const addUser = (user: Partial<User>): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Users`, user, true);
};

export const updateUser = (user: Partial<User>): Promise<boolean> => {
  return put<boolean>(`${API_URL}/Users`, user, true);
};

export const deleteUser = (id: number): Promise<boolean> => {
  return del<boolean>(`${API_URL}/Users`, { id }, true);
};
