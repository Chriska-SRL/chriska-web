import { useState, useEffect, useMemo } from 'react';
import { Purchase } from '@/entities/purchase';
import {
  addPurchase,
  deletePurchase,
  getPurchaseById,
  getPurchases,
  updatePurchase,
  changePurchaseStatus,
} from '@/services/purchase';
import { useFetch, useMutation } from '@/utils/useFetch';

export const useGetPurchases = (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    status?: string;
    supplierId?: number;
    invoiceNumber?: string;
    fromDate?: string;
    toDate?: string;
  },
) => {
  const [data, setData] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [filters?.status, filters?.supplierId, filters?.invoiceNumber, filters?.fromDate, filters?.toDate],
  );

  const fetchPurchases = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getPurchases(page, pageSize, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useGetPurchaseById = (id: number) => useFetch<number, Purchase>(getPurchaseById, id);

export const useAddPurchase = () => useMutation<Partial<Purchase>, Purchase>(addPurchase, { parseFieldError: true });

export const useUpdatePurchase = () =>
  useMutation<Partial<Purchase>, Purchase>(updatePurchase, { parseFieldError: true });

export const useDeletePurchase = (id?: number) => useFetch<number, Purchase>(deletePurchase, id);

export const useChangePurchaseStatus = (props?: { id: number; status: string }) => {
  const [data, setData] = useState<Purchase>();
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
        const result = await changePurchaseStatus(props.id, props.status);
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
