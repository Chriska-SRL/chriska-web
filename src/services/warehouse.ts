import { Warehouse } from '@/entities/warehouse';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getWarehouses = (): Promise<Warehouse[]> => {
  return get<Warehouse[]>(`${API_URL}/Warehouses`);
};

export const addWarehouse = (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  return post<Warehouse>(`${API_URL}/Warehouses`, warehouse);
};

export const updateWarehouse = (warehouse: Partial<Warehouse>): Promise<Warehouse> => {
  return put<Warehouse>(`${API_URL}/Warehouses`, warehouse);
};

export const deleteWarehouse = (id: number): Promise<Warehouse> => {
  return del<Warehouse>(`${API_URL}/Warehouses/${id}`);
};
