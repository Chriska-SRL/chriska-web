import { Warehouse } from '@/entities/warehouse';
import { getWarehouses, addWarehouse, updateWarehouse, deleteWarehouse } from '@/services/warehouse';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetWarehouses = () => useFetchNoParams<Warehouse[]>(getWarehouses, []);

export const useAddWarehouse = (props?: Partial<Warehouse>) =>
  useFetch<Partial<Warehouse>, Warehouse>(addWarehouse, props, { parseFieldError: true });

export const useUpdateWarehouse = (props?: Partial<Warehouse>) =>
  useFetch<Partial<Warehouse>, Warehouse>(updateWarehouse, props, { parseFieldError: true });

export const useDeleteWarehouse = (id?: number) => useFetch<number, Warehouse>(deleteWarehouse, id);
