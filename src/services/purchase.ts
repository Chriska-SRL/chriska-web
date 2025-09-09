import { get, post, put, del } from '@/utils/fetcher';
import { Purchase } from '@/entities/purchase';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type PurchaseFilters = {
  status?: string;
  supplierId?: number;
  invoiceNumber?: string;
  fromDate?: string;
  toDate?: string;
};

export const getPurchases = (
  page: number = 1,
  pageSize: number = 10,
  filters?: PurchaseFilters,
): Promise<Purchase[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.status) {
    params.append('filters[Status]', filters.status);
  }

  if (filters?.supplierId) {
    params.append('filters[SupplierId]', filters.supplierId.toString());
  }

  if (filters?.invoiceNumber) {
    params.append('filters[InvoiceNumber]', filters.invoiceNumber);
  }

  if (filters?.fromDate) {
    params.append('filters[DateFrom]', filters.fromDate);
  }

  if (filters?.toDate) {
    params.append('filters[DateTo]', filters.toDate);
  }

  return get<Purchase[]>(`${API_URL}/Purchases?${params.toString()}`);
};

export const getPurchaseById = (id: number): Promise<Purchase> => get<Purchase>(`${API_URL}/Purchases/${id}`);

export const addPurchase = (purchase: Partial<Purchase>): Promise<Purchase> =>
  post<Purchase>(`${API_URL}/Purchases`, purchase);

export const updatePurchase = (purchase: Partial<Purchase>): Promise<Purchase> =>
  put<Purchase>(`${API_URL}/Purchases/${purchase.id}`, purchase);

export const deletePurchase = (id: number): Promise<Purchase> => del<Purchase>(`${API_URL}/Purchases/${id}`);

export const changePurchaseStatus = (id: number, status: string): Promise<Purchase> => {
  return put<Purchase>(`${API_URL}/Purchases/changestatus/${id}`, { status });
};
