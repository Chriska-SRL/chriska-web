import { Client } from '@/entities/client';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getClients = (): Promise<Client[]> => {
  return get<Client[]>(`${API_URL}/Clients`);
};

export const addClient = (client: Partial<Client>): Promise<Client> => {
  return post<Client>(`${API_URL}/Clients`, client);
};

export const updateClient = (client: Partial<Client>): Promise<Client> => {
  return put<Client>(`${API_URL}/Clients`, client);
};

export const deleteClient = (id: number): Promise<Client> => {
  return del<Client>(`${API_URL}/Clients/${id}`);
};
