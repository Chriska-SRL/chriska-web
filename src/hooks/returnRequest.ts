import { useState, useEffect, useMemo } from 'react';
import { ReturnRequest } from '@/entities/returnRequest';
import {
  getReturnRequests,
  getReturnRequestById,
  createReturnRequest,
  updateReturnRequest,
  deleteReturnRequest,
  changeReturnRequestStatus,
} from '@/services/returnRequest';
import { useFetch, useMutation } from '@/utils/useFetch';

type CreateReturnRequestData = {
  deliveryId: number;
  observations?: string;
};

type ReturnRequestFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const useGetReturnRequests = (page: number = 1, pageSize: number = 10, filters?: ReturnRequestFilters) => {
  const [data, setData] = useState<ReturnRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [filters?.status, filters?.clientId, filters?.userId, filters?.fromDate, filters?.toDate],
  );

  const fetchReturnRequests = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getReturnRequests(page, pageSize, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReturnRequests();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useGetReturnRequestById = (id?: number) => useFetch<number, ReturnRequest>(getReturnRequestById, id);

export const useAddReturnRequest = () =>
  useMutation<CreateReturnRequestData, ReturnRequest>(createReturnRequest, { parseFieldError: true });

export const useUpdateReturnRequest = () =>
  useMutation<Partial<ReturnRequest>, ReturnRequest>(updateReturnRequest, { parseFieldError: true });

export const useDeleteReturnRequest = (id?: number) => useFetch<number, void>(deleteReturnRequest, id);

export const useChangeReturnRequestStatus = (props?: { id: number; status: string }) => {
  const [data, setData] = useState<ReturnRequest>();
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
        const result = await changeReturnRequestStatus(props.id, props.status);
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
