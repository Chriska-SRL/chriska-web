import { useState, useEffect } from 'react';
import { Shelve } from '@/entities/shelve';
import { getShelves, addShelve, updateShelve, deleteShelve } from '@/services/shelve';
import { useFetch, useFetchNoParams, useMutation } from '../utils/useFetch';

type ShelveFilters = {
  name?: string;
  warehouseId?: number;
};

export const useGetShelves = (page: number = 1, pageSize: number = 10, filters?: ShelveFilters) => {
  const [data, setData] = useState<Shelve[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchShelves = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getShelves(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShelves();
  }, [page, pageSize, filters]);

  return { data, isLoading, error };
};

export const useGetShelvesSimple = () => useFetchNoParams<Shelve[]>(() => getShelves(1, 1000), []);

export const useAddShelve = () => useMutation<Partial<Shelve>, Shelve>(addShelve, { parseFieldError: true });

export const useUpdateShelve = () => useMutation<Partial<Shelve>, Shelve>(updateShelve, { parseFieldError: true });

export const useDeleteShelve = (id?: number) => useFetch<number, Shelve>(deleteShelve, id);
