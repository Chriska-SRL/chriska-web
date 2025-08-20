import { useState, useEffect, useMemo } from 'react';
import { Order } from '@/entities/order';
import { getOrders, getOrderById, updateOrder, changeOrderStatus } from '@/services/order';
import { useFetch } from '@/utils/useFetch';

type OrderFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const useGetOrders = (page: number = 1, pageSize: number = 10, filters?: OrderFilters) => {
  const [data, setData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [filters?.status, filters?.clientId, filters?.userId, filters?.fromDate, filters?.toDate],
  );

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getOrders(page, pageSize, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener las órdenes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error, refetch: fetchOrders };
};

export const useGetOrderById = (id?: number) => {
  const [data, setData] = useState<Order>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchOrder = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getOrderById(id);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener la orden');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  return { data, isLoading, error, refetch: fetchOrder };
};

export const useUpdateOrder = (props?: Partial<Order>) =>
  useFetch<Partial<Order>, Order>(updateOrder, props, { parseFieldError: true });

export const useChangeOrderStatus = (props?: { id: number; status: string }) => {
  const [data, setData] = useState<Order>();
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
        const result = await changeOrderStatus(props.id, props.status);
        setData(result);
      } catch (err: any) {
        try {
          const parsed = JSON.parse(err.message);
          setFieldError(parsed);
        } catch {
          setFieldError({ error: err.message || 'Error al cambiar estado de la orden' });
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
