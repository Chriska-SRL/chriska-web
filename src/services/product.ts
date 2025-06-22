import { Product } from '@/entities/product';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getProducts = (): Promise<Product[]> => {
  return get<Product[]>(`${API_URL}/Products`);
};

export const addProduct = (product: Partial<Product>): Promise<Product> => {
  return post<Product>(`${API_URL}/Products`, product);
};

export const updateProduct = (product: Partial<Product>): Promise<Product> => {
  return put<Product>(`${API_URL}/Products`, product);
};

export const deleteProduct = (id: number): Promise<Product> => {
  return del<Product>(`${API_URL}/Products/${id}`);
};
