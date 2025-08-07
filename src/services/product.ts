import { Product } from '@/entities/product';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProductFilters = {
  name?: string;
  internalCode?: string;
  barcode?: string;
  unitType?: string;
  brandId?: number;
  categoryId?: number;
  subCategoryId?: number;
};

export const getProducts = (page: number = 1, pageSize: number = 10, filters?: ProductFilters): Promise<Product[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  if (filters?.internalCode) {
    params.append('filters[InternalCode]', filters.internalCode);
  }

  if (filters?.barcode) {
    params.append('filters[Barcode]', filters.barcode);
  }

  if (filters?.unitType) {
    params.append('filters[UnitType]', filters.unitType);
  }

  if (filters?.brandId) {
    params.append('filters[BrandId]', filters.brandId.toString());
  }

  if (filters?.categoryId) {
    params.append('filters[CategoryId]', filters.categoryId.toString());
  }

  if (filters?.subCategoryId) {
    params.append('filters[SubCategoryId]', filters.subCategoryId.toString());
  }

  return get<Product[]>(`${API_URL}/Products?${params.toString()}`);
};

export const getProductById = (id: number): Promise<Product> => {
  return get<Product>(`${API_URL}/Products/${id}`);
};

export const addProduct = (product: Partial<Product>): Promise<Product> => {
  return post<Product>(`${API_URL}/Products`, product);
};

export const updateProduct = (product: Partial<Product>): Promise<Product> => {
  return put<Product>(`${API_URL}/Products/${product.id}`, product);
};

export const deleteProduct = (id: number): Promise<Product> => {
  return del<Product>(`${API_URL}/Products/${id}`);
};

export const uploadProductImage = async (id: number, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  // Upload the image and return the URL directly
  return post<string>(`${API_URL}/Products/${id}/upload-image`, formData);
};

export const deleteProductImage = (id: number): Promise<void> => {
  return post<void>(`${API_URL}/Products/${id}/delete-image`, undefined);
};
