import { Category } from '@/entities/category';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getCategories = (): Promise<Category[]> => {
  return get<Category[]>(`${API_URL}/Categories`);
};

export const addCategory = (category: Partial<Category>): Promise<Category> => {
  return post<Category>(`${API_URL}/Categories`, category);
};

export const updateCategory = (category: Partial<Category>): Promise<Category> => {
  return put<Category>(`${API_URL}/Categories`, category);
};

export const deleteCategory = (id: number): Promise<Category> => {
  return del<Category>(`${API_URL}/Categories/${id}`);
};
