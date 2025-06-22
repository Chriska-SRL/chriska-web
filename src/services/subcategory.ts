import { SubCategory } from '@/entities/subcategory';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSubCategories = (): Promise<SubCategory[]> => {
  return get<SubCategory[]>(`${API_URL}/Categories/subcategories`);
};

export const addSubCategory = (subcategory: Partial<SubCategory>): Promise<SubCategory> => {
  return post<SubCategory>(`${API_URL}/Categories/subcategories`, subcategory);
};

export const updateSubCategory = (subcategory: Partial<SubCategory>): Promise<SubCategory> => {
  return put<SubCategory>(`${API_URL}/Categories/subcategories`, subcategory);
};

export const deleteSubCategory = (id: number): Promise<SubCategory> => {
  return del<SubCategory>(`${API_URL}/Categories/subcategories/${id}`);
};
