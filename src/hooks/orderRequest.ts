import { useState, useEffect, useMemo } from 'react';
import { OrderRequest } from '@/entities/orderRequest';
import {
  getOrderRequests,
  getOrderRequestById,
  createOrderRequest,
  updateOrderRequest,
  deleteOrderRequest,
  changeOrderRequestStatus,
} from '@/services/orderRequest';
import { useFetch } from '@/utils/useFetch';

type CreateOrderRequestData = {
  observations?: string;
  date?: string;
  status?: string;
  clientId?: number;
  userId?: number;
  productItems?: {
    productId: number;
    quantity: number;
    weight: number;
    unitPrice: number;
    discount: number;
  }[];
};

type OrderRequestFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const useGetOrderRequests = (page: number = 1, pageSize: number = 10, filters?: OrderRequestFilters) => {
  const [data, setData] = useState<OrderRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [filters?.status, filters?.clientId, filters?.userId, filters?.fromDate, filters?.toDate],
  );

  const fetchOrderRequests = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getOrderRequests(page, pageSize, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderRequests();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useGetOrderRequestById = (id?: number) => useFetch<number, OrderRequest>(getOrderRequestById, id);

export const useAddOrderRequest = (props?: CreateOrderRequestData) =>
  useFetch<CreateOrderRequestData, OrderRequest>(createOrderRequest, props, { parseFieldError: true });

export const useUpdateOrderRequest = (props?: Partial<OrderRequest>) =>
  useFetch<Partial<OrderRequest>, OrderRequest>(updateOrderRequest, props, { parseFieldError: true });

export const useDeleteOrderRequest = (id?: number) => useFetch<number, void>(deleteOrderRequest, id);

export const useChangeOrderRequestStatus = (props?: { id: number; status: string }) =>
  useFetch<{ id: number; status: string }, OrderRequest>(
    ({ id, status }) => changeOrderRequestStatus(id, status),
    props,
  );
