import { Client } from '@/entities/client';
import { getClients, addClient, updateClient, deleteClient } from '@/services/client';
import { useFetch, useFetchNoParams } from '../utils/useFetch';
import { useState, useEffect } from 'react';

export const useGetClients = (page: number = 1, pageSize: number = 10, filters?: any) => {
  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getClients(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [page, pageSize, filters]);

  return { data, isLoading, error };
};

export const useAddClient = (props?: Partial<Client>) =>
  useFetch<Partial<Client>, Client>(addClient, props, { parseFieldError: true });

export const useUpdateClient = (props?: Partial<Client>) =>
  useFetch<Partial<Client>, Client>(updateClient, props, { parseFieldError: true });

export const useDeleteClient = (id?: number) => useFetch<number, Client>(deleteClient, id);
