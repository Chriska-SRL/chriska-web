import { useState, useEffect } from 'react';
import { Category } from '@/entities/category';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/services/category';
import { useFetch, useMutation } from '../utils/useFetch';

type CategoryFilters = {
  name?: string;
};

export const useGetCategories = (page: number = 1, pageSize: number = 10, filters?: CategoryFilters) => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getCategories(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [page, pageSize, filters]);

  return { data, isLoading, error };
};

export const useAddCategory = () => useMutation<Partial<Category>, Category>(addCategory, { parseFieldError: true });

export const useUpdateCategory = () =>
  useMutation<Partial<Category>, Category>(updateCategory, { parseFieldError: true });

export const useDeleteCategory = (id?: number) => useFetch<number, Category>(deleteCategory, id);
