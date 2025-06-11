import { Product } from '@/entities/product';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = (): Promise<Product[]> => {
  return get<Product[]>(`${API_URL}/Products`, true);
};

export const addProduct = (product: Partial<Product>): Promise<boolean> => {
  return post<boolean>(`${API_URL}/Products`, product, true);
};

export const updateProduct = (product: Partial<Product>): Promise<boolean> => {
  return put<boolean>(`${API_URL}/Products`, product, true);
};

export const deleteProduct = (id: number): Promise<boolean> => {
  return del<boolean>(`${API_URL}/Products`, { id }, true);
};
