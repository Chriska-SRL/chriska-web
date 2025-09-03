import { useState, useEffect } from 'react';
import { SupplierReceipt } from '@/entities/supplierReceipt';
import {
  addSupplierReceipt,
  deleteSupplierReceipt,
  getSupplierReceiptById,
  getSupplierReceipts,
  updateSupplierReceipt,
} from '@/services/supplierReceipt';
import { useFetch, useMutation } from '@/utils/useFetch';

export const useGetSupplierReceipts = (
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    supplierId?: number;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
  },
) => {
  const [data, setData] = useState<SupplierReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchSupplierReceipts = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getSupplierReceipts(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupplierReceipts();
  }, [page, pageSize, filters?.supplierId, filters?.paymentMethod, filters?.fromDate, filters?.toDate]);

  return { data, isLoading, error };
};

export const useGetSupplierReceiptById = (id: number) => useFetch<number, SupplierReceipt>(getSupplierReceiptById, id);

export const useAddSupplierReceipt = () =>
  useMutation<Partial<SupplierReceipt>, SupplierReceipt>(addSupplierReceipt, { parseFieldError: true });

export const useUpdateSupplierReceipt = () =>
  useMutation<Partial<SupplierReceipt>, SupplierReceipt>(updateSupplierReceipt, { parseFieldError: true });

export const useDeleteSupplierReceipt = (id?: number) => useFetch<number, SupplierReceipt>(deleteSupplierReceipt, id);
