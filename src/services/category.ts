import { Category } from '@/entities/category';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CategoryFilters = {
  name?: string;
};

export const getCategories = (
  page: number = 1,
  pageSize: number = 10,
  filters?: CategoryFilters,
): Promise<Category[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  return get<Category[]>(`${API_URL}/Categories?${params.toString()}`);
};

export const addCategory = (category: Partial<Category>): Promise<Category> => {
  return post<Category>(`${API_URL}/Categories`, category);
};

export const updateCategory = (category: Partial<Category>): Promise<Category> => {
  return put<Category>(`${API_URL}/Categories/${category.id}`, category);
};

export const deleteCategory = (id: number): Promise<Category> => {
  return del<Category>(`${API_URL}/Categories/${id}`);
};
