import { SubCategory } from '@/entities/subcategory';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SubCategoryFilters = {
  name?: string;
  categoryId?: number;
};

export const getSubCategories = (page: number = 1, pageSize: number = 10, filters?: SubCategoryFilters): Promise<SubCategory[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());
  
  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }
  
  if (filters?.categoryId) {
    params.append('filters[CategoryId]', filters.categoryId.toString());
  }
  
  return get<SubCategory[]>(`${API_URL}/Categories/subcategories?${params.toString()}`);
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
