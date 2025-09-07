import { useState, useEffect } from 'react';
import { Supplier } from '@/entities/supplier';
import { addSupplier, deleteSupplier, getSuppliers, getSupplierById, updateSupplier } from '@/services/supplier';
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

export const useGetSupplierById = (id?: number) => {
  const [data, setData] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id) {
      setData(null);
      setError(undefined);
      return;
    }

    const fetchSupplier = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getSupplierById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  return { data, isLoading, error };
};

export const useDeleteSupplier = (id?: number) => useFetch<number, Supplier>(deleteSupplier, id);
