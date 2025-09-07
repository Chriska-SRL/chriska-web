import { Supplier } from '@/entities/supplier';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSuppliers = (page: number = 1, pageSize: number = 10, filterName?: string): Promise<Supplier[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filterName) {
    params.append('filters[Name]', filterName);
  }

  return get<Supplier[]>(`${API_URL}/Suppliers?${params.toString()}`);
};

export const addSupplier = (supplier: Partial<Supplier>): Promise<Supplier> => {
  return post<Supplier>(`${API_URL}/Suppliers`, supplier);
};

export const updateSupplier = (supplier: Partial<Supplier>): Promise<Supplier> => {
  return put<Supplier>(`${API_URL}/Suppliers/${supplier.id}`, supplier);
};

export const getSupplierById = (id: number): Promise<Supplier> => {
  return get<Supplier>(`${API_URL}/Suppliers/${id}`);
};

export const deleteSupplier = (id: number): Promise<Supplier> => {
  return del<Supplier>(`${API_URL}/Suppliers/${id}`);
};
