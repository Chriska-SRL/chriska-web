import { Client } from '@/entities/client';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientFilters = {
  name?: string;
  rut?: string;
  razonSocial?: string;
  contactName?: string;
  qualification?: string;
  zoneId?: string;
};

export const getClients = (page: number = 1, pageSize: number = 10, filters?: ClientFilters): Promise<Client[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  if (filters?.rut) {
    params.append('filters[Rut]', filters.rut);
  }

  if (filters?.razonSocial) {
    params.append('filters[RazonSocial]', filters.razonSocial);
  }

  if (filters?.contactName) {
    params.append('filters[ContactName]', filters.contactName);
  }

  if (filters?.qualification) {
    params.append('filters[Qualification]', filters.qualification);
  }

  if (filters?.zoneId) {
    params.append('filters[ZoneId]', filters.zoneId);
  }

  return get<Client[]>(`${API_URL}/Clients?${params.toString()}`);
};

export const addClient = (client: Partial<Client>): Promise<Client> => {
  return post<Client>(`${API_URL}/Clients`, client);
};

export const updateClient = (client: Partial<Client>): Promise<Client> => {
  return put<Client>(`${API_URL}/Clients/${client.id}`, client);
};

export const deleteClient = (id: number): Promise<Client> => {
  return del<Client>(`${API_URL}/Clients/${id}`);
};
