import { SubCategory } from '@/entities/subcategory';
import { getSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from '@/services/subcategory';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetSubCategories = () => useFetchNoParams<SubCategory[]>(getSubCategories, []);

export const useAddSubCategory = (props?: Partial<SubCategory>) =>
  useFetch<Partial<SubCategory>, SubCategory>(addSubCategory, props, { parseFieldError: true });

export const useUpdateSubCategory = (props?: Partial<SubCategory>) =>
  useFetch<Partial<SubCategory>, SubCategory>(updateSubCategory, props, { parseFieldError: true });

export const useDeleteSubCategory = (id?: number) => useFetch<number, SubCategory>(deleteSubCategory, id);
