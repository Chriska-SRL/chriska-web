import { Supplier } from '@/entities/supplier';
import { getSuppliers, addSupplier, updateSupplier, deleteSupplier } from '@/services/supplier';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetSuppliers = () => useFetchNoParams<Supplier[]>(getSuppliers, []);

export const useAddSupplier = (props?: Partial<Supplier>) =>
  useFetch<Partial<Supplier>, Supplier>(addSupplier, props, { parseFieldError: true });

export const useUpdateSupplier = (props?: Partial<Supplier>) =>
  useFetch<Partial<Supplier>, Supplier>(updateSupplier, props, { parseFieldError: true });

export const useDeleteSupplier = (id?: number) => useFetch<number, Supplier>(deleteSupplier, id);
