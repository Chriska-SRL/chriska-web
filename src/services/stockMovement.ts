import { StockMovement } from '@/entities/stockMovement';
import { get, post } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type StockMovementFilters = {
  Type?: string;
  DateFrom?: string;
  DateTo?: string;
  ProductId?: number;
  CreatedBy?: number;
};

export const getStockMovements = (
  page: number = 1,
  pageSize: number = 10,
  filters: StockMovementFilters,
): Promise<StockMovement[]> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  if (filters.Type) {
    params.append('filters[Type]', filters.Type);
  }

  if (filters.DateFrom) {
    params.append('filters[DateFrom]', filters.DateFrom);
  }

  if (filters.DateTo) {
    params.append('filters[DateTo]', filters.DateTo);
  }

  if (filters.ProductId) {
    params.append('filters[ProductId]', filters.ProductId.toString());
  }

  if (filters.CreatedBy) {
    params.append('filters[CreatedBy]', filters.CreatedBy.toString());
  }

  return get<StockMovement[]>(`${API_URL}/Stock?${params.toString()}`);
};

export const getStockMovementById = (id: number): Promise<StockMovement> => {
  return get<StockMovement>(`${API_URL}/Stock/${id}`);
};

export const addStockMovement = (Stock: Partial<StockMovement>): Promise<StockMovement> => {
  return post<StockMovement>(`${API_URL}/Stock`, Stock);
};
