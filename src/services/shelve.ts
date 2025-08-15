import { Shelve } from '@/entities/shelve';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ShelveFilters = {
  name?: string;
  warehouseId?: number;
};

export const getShelves = (page: number = 1, pageSize: number = 10, filters?: ShelveFilters): Promise<Shelve[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  if (filters?.warehouseId) {
    params.append('filters[WarehouseId]', filters.warehouseId.toString());
  }

  return get<Shelve[]>(`${API_URL}/Shelves?${params.toString()}`);
};

export const addShelve = (shelve: Partial<Shelve>): Promise<Shelve> => {
  return post<Shelve>(`${API_URL}/Shelves`, shelve);
};

export const updateShelve = (shelve: Partial<Shelve>): Promise<Shelve> => {
  return put<Shelve>(`${API_URL}/Shelves/${shelve.id}`, shelve);
};

export const deleteShelve = (id: number): Promise<Shelve> => {
  return del<Shelve>(`${API_URL}/Shelves/${id}`);
};
