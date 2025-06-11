import { Category } from '@/entities/category';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCategories = (): Promise<Category[]> => {
  return get<Category[]>(`${API_URL}/Categories`, true);
};

export const addCategory = (category: Partial<Category>): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Categories`, category, true);
};

export const updateCategory = (category: Partial<Category>): Promise<boolean> => {
  return put<boolean>(`${API_URL}/Categories`, category, true);
};

export const deleteCategory = (id: number): Promise<boolean> => {
  return del<boolean>(`${API_URL}/Categories`, { id }, true);
};
