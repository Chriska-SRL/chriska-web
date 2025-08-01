import { Brand } from '@/entities/brand';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getBrands = (page: number = 1, pageSize: number = 10, filterName?: string): Promise<Brand[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());
  
  if (filterName) {
    params.append('filters[Name]', filterName);
  }
  
  return get<Brand[]>(`${API_URL}/Brands?${params.toString()}`);
};

export const addBrand = (brand: Partial<Brand>): Promise<Brand> => {
  return post<Brand>(`${API_URL}/Brands`, brand);
};

export const updateBrand = (brand: Partial<Brand>): Promise<Brand> => {
  return put<Brand>(`${API_URL}/Brands/${brand.id}`, brand);
};

export const deleteBrand = (id: number): Promise<Brand> => {
  return del<Brand>(`${API_URL}/Brands/${id}`);
};
