import { useState, useEffect } from 'react';
import { Warehouse } from '@/entities/warehouse';
import { getWarehouses, addWarehouse, updateWarehouse, deleteWarehouse } from '@/services/warehouse';
import { useFetch, useFetchNoParams, useMutation } from '../utils/useFetch';

type WarehouseFilters = {
  name?: string;
};

export const useGetWarehouses = (page: number = 1, pageSize: number = 10, filters?: WarehouseFilters) => {
  const [data, setData] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchWarehouses = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getWarehouses(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarehouses();
  }, [page, pageSize, filters]);

  return { data, isLoading, error };
};

export const useGetWarehousesSimple = () => useFetchNoParams<Warehouse[]>(() => getWarehouses(1, 1000), []);

export const useAddWarehouse = () =>
  useMutation<Partial<Warehouse>, Warehouse>(addWarehouse, { parseFieldError: true });

export const useUpdateWarehouse = () =>
  useMutation<Partial<Warehouse>, Warehouse>(updateWarehouse, { parseFieldError: true });

export const useDeleteWarehouse = (id?: number) => useFetch<number, Warehouse>(deleteWarehouse, id);
