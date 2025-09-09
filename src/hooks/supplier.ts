import { useState, useEffect, useMemo } from 'react';
import { Supplier } from '@/entities/supplier';
import { addSupplier, deleteSupplier, getSuppliers, getSupplierById, updateSupplier } from '@/services/supplier';
import { useFetch, useMutation } from '@/utils/useFetch';

type SupplierFilters = {
  name?: string;
  rut?: string;
  razonSocial?: string;
  contactName?: string;
};

// Overloaded function for backward compatibility
export function useGetSuppliers(
  page: number,
  pageSize: number,
  filterName: string,
): { data: Supplier[]; isLoading: boolean; error?: string };
export function useGetSuppliers(
  page: number,
  pageSize: number,
  filters: SupplierFilters,
): { data: Supplier[]; isLoading: boolean; error?: string };
export function useGetSuppliers(
  page?: number,
  pageSize?: number,
  filtersOrName?: SupplierFilters | string,
): { data: Supplier[]; isLoading: boolean; error?: string };

export function useGetSuppliers(page: number = 1, pageSize: number = 10, filtersOrName?: SupplierFilters | string) {
  const [data, setData] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Convert old filterName format to new filters format for backward compatibility
  const filters = useMemo(() => {
    if (!filtersOrName) return undefined;
    if (typeof filtersOrName === 'string') {
      return { name: filtersOrName };
    }
    return filtersOrName;
  }, [filtersOrName]);

  const memoizedFilters = useMemo(
    () => filters,
    [filters?.name, filters?.rut, filters?.razonSocial, filters?.contactName],
  );

  useEffect(() => {
    const fetchSuppliers = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getSuppliers(page, pageSize, memoizedFilters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuppliers();
  }, [
    page,
    pageSize,
    memoizedFilters?.name,
    memoizedFilters?.rut,
    memoizedFilters?.razonSocial,
    memoizedFilters?.contactName,
  ]);

  return { data, isLoading, error };
}

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
