import { StockMovement } from '@/entities/stockMovement';
import { get, post } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type StockMovementFilters = {
  warehouseId?: number;
  shelveId?: number;
};

export const getStockMovements = (
  page: number = 1,
  pageSize: number = 10,
  filters: StockMovementFilters,
): Promise<StockMovement[]> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('pageSize', pageSize.toString());

  if (filters.warehouseId) {
    params.append('filters[WarehouseId]', filters.warehouseId.toString());
  }

  if (filters.shelveId) {
    params.append('filters[ShelveId]', filters.shelveId.toString());
  }

  return get<StockMovement[]>(`${API_URL}/Stock?${params.toString()}`);
};

export const getStockMovementById = (id: number): Promise<StockMovement> => {
  return get<StockMovement>(`${API_URL}/Stock/${id}`);
};

export const addStockMovement = (Stock: Partial<StockMovement>): Promise<StockMovement> => {
  return post<StockMovement>(`${API_URL}/Stock`, Stock);
};
