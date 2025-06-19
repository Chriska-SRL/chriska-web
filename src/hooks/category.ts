import { Category } from '@/entities/category';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/services/category';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetCategories = () => useFetchNoParams<Category[]>(getCategories, []);

export const useAddCategory = (props?: Partial<Category>) =>
  useFetch<Partial<Category>, Category>(addCategory, props, { parseFieldError: true });

export const useUpdateCategory = (props?: Partial<Category>) =>
  useFetch<Partial<Category>, Category>(updateCategory, props, { parseFieldError: true });

export const useDeleteCategory = (id?: number) => useFetch<number, Category>(deleteCategory, id);
