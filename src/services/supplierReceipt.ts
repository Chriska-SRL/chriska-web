import { get, post, put, del } from '@/utils/fetcher';
import { SupplierReceipt } from '@/entities/supplierReceipt';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type SupplierReceiptFilters = {
  supplierId?: number;
  paymentMethod?: string;
  fromDate?: string;
  toDate?: string;
};

export const getSupplierReceipts = (
  page: number = 1,
  pageSize: number = 10,
  filters?: SupplierReceiptFilters,
): Promise<SupplierReceipt[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.supplierId) {
    params.append('filters[SupplierId]', filters.supplierId.toString());
  }

  if (filters?.paymentMethod) {
    params.append('filters[PaymentMethod]', filters.paymentMethod);
  }

  if (filters?.fromDate) {
    params.append('filters[DateFrom]', filters.fromDate);
  }

  if (filters?.toDate) {
    params.append('filters[DateTo]', filters.toDate);
  }

  return get<SupplierReceipt[]>(`${API_URL}/SupplierReceipts?${params.toString()}`);
};

export const getSupplierReceiptById = (id: number): Promise<SupplierReceipt> =>
  get<SupplierReceipt>(`${API_URL}/SupplierReceipts/${id}`);

export const addSupplierReceipt = (receipt: Partial<SupplierReceipt>): Promise<SupplierReceipt> =>
  post<SupplierReceipt>(`${API_URL}/SupplierReceipts`, receipt);

export const updateSupplierReceipt = (receipt: Partial<SupplierReceipt>): Promise<SupplierReceipt> =>
  put<SupplierReceipt>(`${API_URL}/SupplierReceipts/${receipt.id}`, receipt);

export const deleteSupplierReceipt = (id: number): Promise<SupplierReceipt> =>
  del<SupplierReceipt>(`${API_URL}/SupplierReceipts/${id}`);
