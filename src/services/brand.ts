import { Brand } from '@/entities/brand';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBrands = (): Promise<Brand[]> => {
  return get<Brand[]>(`${API_URL}/Products/brands`);
};

export const addBrand = (brand: Partial<Brand>): Promise<Brand> => {
  return post<Brand>(`${API_URL}/Products/brand`, brand);
};

export const updateBrand = (brand: Partial<Brand>): Promise<Brand> => {
  return put<Brand>(`${API_URL}/Products/brand`, brand);
};

export const deleteBrand = (id: number): Promise<Brand> => {
  return del<Brand>(`${API_URL}/Products/brand/${id}`);
};
