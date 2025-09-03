import { get, post, put, del } from '@/utils/fetcher';
import { ClientReceipt } from '@/entities/clientReceipt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientReceiptFilters = {
  clientId?: number;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
};

export const getClientReceipts = (
  page: number = 1,
  pageSize: number = 10,
  filters?: ClientReceiptFilters,
): Promise<ClientReceipt[]> => {
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

  return get<ClientReceipt[]>(`${API_URL}/ClientReceipts?${params.toString()}`);
};

export const getClientReceiptById = (id: number): Promise<ClientReceipt> => get<ClientReceipt>(`${API_URL}/ClientReceipts/${id}`);

export const addClientReceipt = (receipt: Partial<ClientReceipt>): Promise<ClientReceipt> =>
  post<ClientReceipt>(`${API_URL}/ClientReceipts`, receipt);

export const updateClientReceipt = (receipt: Partial<ClientReceipt>): Promise<ClientReceipt> =>
  put<ClientReceipt>(`${API_URL}/ClientReceipts/${receipt.id}`, receipt);

export const deleteClientReceipt = (id: number): Promise<ClientReceipt> => del<ClientReceipt>(`${API_URL}/ClientReceipts/${id}`);
