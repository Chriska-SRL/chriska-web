import { useState, useEffect } from 'react';
import { ClientReceipt } from '@/entities/clientReceipt';
import {
  addClientReceipt,
  deleteClientReceipt,
  getClientReceiptById,
  getClientReceipts,
  updateClientReceipt,
} from '@/services/receipt';
import { useFetch, useMutation } from '@/utils/useFetch';

export const useGetClientReceipts = (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    clientId?: number;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
  },
) => {
  const [data, setData] = useState<ClientReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchClientReceipts = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getClientReceipts(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientReceipts();
  }, [page, pageSize, filters?.clientId, filters?.paymentMethod, filters?.fromDate, filters?.toDate]);

  return { data, isLoading, error };
};

export const useGetClientReceiptById = (id: number) => useFetch<number, ClientReceipt>(getClientReceiptById, id);

export const useAddClientReceipt = () =>
  useMutation<Partial<ClientReceipt>, ClientReceipt>(addClientReceipt, { parseFieldError: true });

export const useUpdateClientReceipt = () =>
  useMutation<Partial<ClientReceipt>, ClientReceipt>(updateClientReceipt, { parseFieldError: true });

export const useDeleteClientReceipt = (id?: number) => useFetch<number, ClientReceipt>(deleteClientReceipt, id);
