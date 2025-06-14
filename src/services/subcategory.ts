import { SubCategory } from '@/entities/subcategory';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSubCategories = (): Promise<SubCategory[]> => {
  return get<SubCategory[]>(`${API_URL}/Categories/subcategories`, true);
};

export const addSubCategory = (subcategory: Partial<SubCategory>): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Categories/subcategories`, subcategory, true);
};

export const updateSubCategory = (subcategory: Partial<SubCategory>): Promise<boolean> => {
  return put<boolean>(`${API_URL}/Categories/subcategories`, subcategory, true);
};

export const deleteSubCategory = (id: number): Promise<boolean> => {
  return del<boolean>(`${API_URL}/Categories/subcategories/${id}`, true);
};
