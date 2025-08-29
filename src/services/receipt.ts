import { get, post, put, del } from '@/utils/fetcher';
import { Receipt } from '@/entities/receipt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ReceiptFilters = {
  clientId?: number;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
};

export const getReceipts = (page: number = 1, pageSize: number = 10, filters?: ReceiptFilters): Promise<Receipt[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.clientId) {
    params.append('filters[ClientId]', filters.clientId.toString());
  }

  if (filters?.paymentMethod) {
    params.append('filters[PaymentMethod]', filters.paymentMethod);
  }

  if (filters?.fromDate) {
    params.append('filters[FromDate]', filters.fromDate);
  }

  if (filters?.toDate) {
    params.append('filters[ToDate]', filters.toDate);
  }

  return get<Receipt[]>(`${API_URL}/Receipts?${params.toString()}`);
};

export const getReceiptById = (id: number): Promise<Receipt> => get<Receipt>(`${API_URL}/Receipts/${id}`);

export const addReceipt = (receipt: Partial<Receipt>): Promise<Receipt> =>
  post<Receipt>(`${API_URL}/Receipts`, receipt);

export const updateReceipt = (receipt: Partial<Receipt>): Promise<Receipt> =>
  put<Receipt>(`${API_URL}/Receipts/${receipt.id}`, receipt);

export const deleteReceipt = (id: number): Promise<Receipt> => del<Receipt>(`${API_URL}/Receipts/${id}`);
