import { Warehouse } from '@/entities/warehouse';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type WarehouseFilters = {
  name?: string;
};

export const getWarehouses = (
  page: number = 1,
  pageSize: number = 10,
  filters?: WarehouseFilters,
): Promise<Warehouse[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  return get<Warehouse[]>(`${API_URL}/Warehouses?${params.toString()}`);
};

export const addWarehouse = (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  return post<Warehouse>(`${API_URL}/Warehouses`, warehouse);
};

export const updateWarehouse = (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  return put<Warehouse>(`${API_URL}/Warehouses/${warehouse.id}`, warehouse);
};

export const deleteWarehouse = (id: number): Promise<Warehouse> => {
  return del<Warehouse>(`${API_URL}/Warehouses/${id}`);
};
