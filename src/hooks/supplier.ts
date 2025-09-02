import { useState, useEffect } from 'react';
import { Supplier } from '@/entities/supplier';
import { addSupplier, deleteSupplier, getSuppliers, updateSupplier } from '@/services/supplier';
import { useFetch, useMutation } from '@/utils/useFetch';

export const useGetSuppliers = (page: number = 1, pageSize: number = 10, filterName?: string) => {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getSuppliers(page, pageSize, filterName);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [page, pageSize, filterName]);

  return { data, isLoading, error };
};

export const useAddSupplier = () => useMutation<Partial<Supplier>, Supplier>(addSupplier, { parseFieldError: true });

export const useUpdateSupplier = () =>
  useMutation<Partial<Supplier>, Supplier>(updateSupplier, { parseFieldError: true });

export const useDeleteSupplier = (id?: number) => useFetch<number, Supplier>(deleteSupplier, id);
