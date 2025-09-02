import { useState, useEffect } from 'react';
import { Receipt } from '@/entities/receipt';
import { addReceipt, deleteReceipt, getReceiptById, getReceipts, updateReceipt } from '@/services/receipt';
import { useFetch, useMutation } from '@/utils/useFetch';

export const useGetReceipts = (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    clientId?: number;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
  },
) => {
  const [data, setData] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getReceipts(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceipts();
  }, [page, pageSize, filters?.clientId, filters?.paymentMethod, filters?.fromDate, filters?.toDate]);

  return { data, isLoading, error };
};

export const useGetReceiptById = (id: number) => useFetch<number, Receipt>(getReceiptById, id);

export const useAddReceipt = () => useMutation<Partial<Receipt>, Receipt>(addReceipt, { parseFieldError: true });

export const useUpdateReceipt = () => useMutation<Partial<Receipt>, Receipt>(updateReceipt, { parseFieldError: true });

export const useDeleteReceipt = (id?: number) => useFetch<number, Receipt>(deleteReceipt, id);
