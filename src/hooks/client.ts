import { Client } from '@/entities/client';
import { getClients, addClient, updateClient, deleteClient } from '@/services/client';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetClients = () => useFetchNoParams<Client[]>(getClients, []);

export const useAddClient = (props?: Partial<Client>) =>
  useFetch<Partial<Client>, Client>(addClient, props, { parseFieldError: true });

export const useUpdateClient = (props?: Partial<Client>) =>
  useFetch<Partial<Client>, Client>(updateClient, props, { parseFieldError: true });

export const useDeleteClient = (id?: number) => useFetch<number, Client>(deleteClient, id);
