import { useState, useEffect } from 'react';
import { SubCategory } from '@/entities/subcategory';
import { getSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from '@/services/subcategory';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

type SubCategoryFilters = {
  name?: string;
  categoryId?: number;
};

export const useGetSubCategories = (page: number = 1, pageSize: number = 10, filters?: SubCategoryFilters) => {
  const [data, setData] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchSubCategories = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getSubCategories(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubCategories();
  }, [page, pageSize, filters]);

  return { data, isLoading, error };
};

export const useGetSubCategoriesSimple = () => useFetchNoParams<SubCategory[]>(() => getSubCategories(1, 1000), []);

export const useAddSubCategory = (props?: Partial<SubCategory>) =>
  useFetch<Partial<SubCategory>, SubCategory>(addSubCategory, props, { parseFieldError: true });

export const useUpdateSubCategory = (props?: Partial<SubCategory>) =>
  useFetch<Partial<SubCategory>, SubCategory>(updateSubCategory, props, { parseFieldError: true });

export const useDeleteSubCategory = (id?: number) => useFetch<number, SubCategory>(deleteSubCategory, id);
