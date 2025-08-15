import { Discount } from '@/entities/discount';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DiscountFilters = {
  description?: string;
  status?: string;
  brandId?: number;
  subCategoryId?: number;
  zoneId?: number;
  clientId?: number;
  productId?: number;
};

export const getDiscounts = (
  page: number = 1,
  pageSize: number = 10,
  filters?: DiscountFilters,
): Promise<Discount[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.description) {
    params.append('filters[Description]', filters.description);
  }

  if (filters?.status) {
    params.append('filters[Status]', filters.status);
  }

  if (filters?.brandId) {
    params.append('filters[BrandId]', filters.brandId.toString());
  }

  if (filters?.subCategoryId) {
    params.append('filters[SubCategoryId]', filters.subCategoryId.toString());
  }

  if (filters?.zoneId) {
    params.append('filters[ZoneId]', filters.zoneId.toString());
  }

  if (filters?.clientId) {
    params.append('filters[ClientId]', filters.clientId.toString());
  }

  if (filters?.productId) {
    params.append('filters[ProductId]', filters.productId.toString());
  }

  return get<Discount[]>(`${API_URL}/Discounts?${params.toString()}`);
};

export const getDiscountById = (id: string): Promise<Discount> => {
  return get<Discount>(`${API_URL}/Discounts/${id}`);
};

export const addDiscount = (discount: {
  description: string;
  expirationDate: string;
  productQuantity: number;
  percentage: number;
  status: string;
  discountProductId: number[];
  discountClientId: number[];
  brandId?: string;
  subCategoryId?: string;
  zoneId?: string;
}): Promise<Discount> => {
  return post<Discount>(`${API_URL}/Discounts`, discount);
};

export const updateDiscount = (
  id: string,
  discount: {
    description?: string;
    expirationDate?: string;
    productQuantity?: number;
    percentage?: number;
    status?: string;
    discountProductId?: number[];
    discountClientId?: number[];
    brandId?: string;
    subCategoryId?: string;
    zoneId?: string;
  },
): Promise<Discount> => {
  return put<Discount>(`${API_URL}/Discounts/${id}`, discount);
};

export const deleteDiscount = (id: string): Promise<Discount> => {
  return del<Discount>(`${API_URL}/Discounts/${id}`);
};
