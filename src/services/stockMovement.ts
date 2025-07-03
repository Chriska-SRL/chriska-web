import { StockMovement } from '@/entities/stockMovement';
import { get, post } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getStockMovements = (params: { from: string; to: string }): Promise<StockMovement[]> => {
  const { from, to } = params;
  return get<StockMovement[]>(`${API_URL}/Stock?from=${from}&to=${to}`);
};

export const getStockMovementById = (id: number): Promise<StockMovement> => {
  return get<StockMovement>(`${API_URL}/Stock/${id}`);
};

export const getStockMovementsByWarehouseId = (params: {
  id: number;
  from: string;
  to: string;
}): Promise<StockMovement[]> => {
  const { id, from, to } = params;
  return get<StockMovement[]>(`${API_URL}/Stock/warehouse/${id}?from=${from}&to=${to}`);
};

export const getStockMovementsByShelveId = (params: {
  id: number;
  from: string;
  to: string;
}): Promise<StockMovement[]> => {
  const { id, from, to } = params;
  return get<StockMovement[]>(`${API_URL}/Stock/shelve/${id}?from=${from}&to=${to}`);
};

export const addStockMovement = (Stock: Partial<StockMovement>): Promise<StockMovement> => {
  return post<StockMovement>(`${API_URL}/Stock`, Stock);
};
