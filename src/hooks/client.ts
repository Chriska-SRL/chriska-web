import { Client } from '@/entities/client';
import { getClients, addClient, updateClient, deleteClient } from '@/services/client';
import { useFetch, useFetchNoParams } from '../utils/useFetch';
import { useState, useEffect } from 'react';

export const useGetClients = (
  page: number = 1, 
  pageSize: number = 10, 
  filterName?: string,
  searchParam?: string,
  filterQualification?: string,
  filterZoneId?: string
) => {
  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const filters: any = {};
        
        // Handle search by parameter
        if (filterName && searchParam) {
          switch (searchParam) {
            case 'name':
              filters.name = filterName;
              break;
            case 'rut':
              filters.rut = filterName;
              break;
            case 'razonSocial':
              filters.razonSocial = filterName;
              break;
            case 'contactName':
              filters.contactName = filterName;
              break;
          }
        }
        
        // Handle advanced filters
        if (filterQualification) filters.qualification = filterQualification;
        if (filterZoneId) filters.zoneId = filterZoneId;
        
        const hasFilters = Object.keys(filters).length > 0;
        const result = await getClients(page, pageSize, hasFilters ? filters : undefined);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [page, pageSize, filterName, filterQualification, filterZoneId]);

  return { data, isLoading, error };
};

export const useAddClient = (props?: Partial<Client>) =>
  useFetch<Partial<Client>, Client>(addClient, props, { parseFieldError: true });

export const useUpdateClient = (props?: Partial<Client>) =>
  useFetch<Partial<Client>, Client>(updateClient, props, { parseFieldError: true });

export const useDeleteClient = (id?: number) => useFetch<number, Client>(deleteClient, id);
