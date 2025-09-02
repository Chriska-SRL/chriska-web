import { useState, useEffect, useMemo } from 'react';
import { Delivery } from '@/entities/delivery';
import {
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  changeDeliveryStatus,
  getConfirmedDeliveriesByClient,
} from '@/services/delivery';
import { useMutation } from '@/utils/useFetch';

type DeliveryFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const useGetDeliveries = (page: number = 1, pageSize: number = 10, filters?: DeliveryFilters) => {
  const [data, setData] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [filters?.status, filters?.clientId, filters?.userId, filters?.fromDate, filters?.toDate],
  );

  const fetchDeliveries = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getDeliveries(page, pageSize, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener las entregas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error, refetch: fetchDeliveries };
};

export const useGetDeliveryById = (id?: number) => {
  const [data, setData] = useState<Delivery>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchDelivery = async () => {
    if (!id) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getDeliveryById(id);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener la entrega');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDelivery();
  }, [id]);

  return { data, isLoading, error, refetch: fetchDelivery };
};

export const useUpdateDelivery = () =>
  useMutation<Partial<Delivery>, Delivery>(updateDelivery, { parseFieldError: true });

export const useChangeDeliveryStatus = (props?: { id: number; status: string }) => {
  const [data, setData] = useState<Delivery>();
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
        const result = await changeDeliveryStatus(props.id, props.status);
        setData(result);
      } catch (err: any) {
        try {
          const parsed = JSON.parse(err.message);
          setFieldError(parsed);
        } catch {
          setFieldError({ error: err.message || 'Error al cambiar estado de la entrega' });
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

export const useGetConfirmedDeliveriesByClient = (clientId?: number) => {
  const [data, setData] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchConfirmedDeliveries = async () => {
    if (!clientId) {
      setData([]);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getConfirmedDeliveriesByClient(clientId);
      setData(result);
    } catch (err: any) {
      setError(err?.message || 'Error al obtener las entregas confirmadas');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfirmedDeliveries();
  }, [clientId]);

  return { data, isLoading, error, refetch: fetchConfirmedDeliveries };
};
