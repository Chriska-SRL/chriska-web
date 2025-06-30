import { Supplier } from '@/entities/supplier';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSuppliers = (): Promise<Supplier[]> => {
  return get<Supplier[]>(`${API_URL}/Suppliers`);
};

export const addSupplier = (Supplier: Partial<Supplier>): Promise<Supplier> => {
  return post<Supplier>(`${API_URL}/Suppliers`, Supplier);
};

export const updateSupplier = (Supplier: Partial<Supplier>): Promise<Supplier> => {
  return put<Supplier>(`${API_URL}/Suppliers`, Supplier);
};

export const deleteSupplier = (id: number): Promise<Supplier> => {
  return del<Supplier>(`${API_URL}/Suppliers/${id}`);
};
