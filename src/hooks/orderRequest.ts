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
import { useFetch, useMutation } from '@/utils/useFetch';

type CreateOrderRequestData = {
  observations?: string;
  date?: string;
  status?: string;
  clientId?: number;
  userId?: number;
  productItems?: {
    productId: number;
    quantity: number;
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

export const useAddOrderRequest = () =>
  useMutation<CreateOrderRequestData, OrderRequest>(createOrderRequest, { parseFieldError: true });

export const useUpdateOrderRequest = () =>
  useMutation<Partial<OrderRequest>, OrderRequest>(updateOrderRequest, { parseFieldError: true });

export const useDeleteOrderRequest = (id?: number) => useFetch<number, void>(deleteOrderRequest, id);

export const useChangeOrderRequestStatus = (props?: { id: number; status: string }) => {
  const [data, setData] = useState<OrderRequest>();
  const [isLoading, setIsLoading] = useState(false);
  const [fieldError, setFieldError] = useState<any>();
  const [hasExecuted, setHasExecuted] = useState(false);

  useEffect(() => {
    if (!props || hasExecuted) return;

    const executeRequest = async () => {
      setHasExecuted(true);
      setIsLoading(true);
      setFieldError(undefined);

      try {
        const result = await changeOrderRequestStatus(props.id, props.status);
        setData(result);
      } catch (err: any) {
        try {
          const parsed = JSON.parse(err.message);
          setFieldError(parsed);
        } catch {
          setFieldError({ error: err.message || 'Error desconocido' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    executeRequest();
  }, [props?.id, props?.status, hasExecuted]);

  // Reset cuando props cambie a undefined
  useEffect(() => {
    if (!props) {
      setHasExecuted(false);
      setData(undefined);
      setFieldError(undefined);
    }
  }, [props]);

  return { data, isLoading, fieldError };
};
