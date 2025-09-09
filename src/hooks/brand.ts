import { Brand } from '@/entities/brand';
import { getBrands, addBrand, updateBrand, deleteBrand } from '@/services/brand';
import { useFetch, useMutation } from '../utils/useFetch';
import { useState, useEffect } from 'react';

export const useGetBrands = (page: number = 1, pageSize: number = 10, filterName?: string) => {
  const [data, setData] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getBrands(page, pageSize, filterName);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, [page, pageSize, filterName]);

  return { data, isLoading, error };
};

export const useAddBrand = () => useMutation<Partial<Brand>, Brand>(addBrand, { parseFieldError: true });

export const useUpdateBrand = () => useMutation<Partial<Brand>, Brand>(updateBrand, { parseFieldError: true });

export const useDeleteBrand = (id?: number) => useFetch<number, Brand>(deleteBrand, id);
