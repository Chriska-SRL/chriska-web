import { OrderRequest } from '@/entities/orderRequest';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type OrderRequestFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const getOrderRequests = (
  page: number = 1,
  pageSize: number = 10,
  filters?: OrderRequestFilters,
): Promise<OrderRequest[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.status) {
    params.append('filters[Status]', filters.status);
  }

  if (filters?.clientId) {
    params.append('filters[ClientId]', filters.clientId.toString());
  }

  if (filters?.userId) {
    params.append('filters[UserId]', filters.userId.toString());
  }

  if (filters?.fromDate) {
    params.append('filters[DateFrom]', filters.fromDate);
  }

  if (filters?.toDate) {
    params.append('filters[DateTo]', filters.toDate);
  }

  return get<OrderRequest[]>(`${API_URL}/OrderRequest?${params.toString()}`);
};

export const getOrderRequestById = (id: number): Promise<OrderRequest> => {
  return get<OrderRequest>(`${API_URL}/OrderRequest/${id}`);
};

export const createOrderRequest = (orderRequest: any): Promise<OrderRequest> => {
  return post<OrderRequest>(`${API_URL}/OrderRequest`, orderRequest);
};

export const updateOrderRequest = (orderRequest: Partial<OrderRequest>): Promise<OrderRequest> => {
  return put<OrderRequest>(`${API_URL}/OrderRequest/${orderRequest.id}`, orderRequest);
};

export const deleteOrderRequest = (id: number): Promise<void> => {
  return del(`${API_URL}/OrderRequest/${id}`);
};

export const changeOrderRequestStatus = (id: number, status: string): Promise<OrderRequest> => {
  return put<OrderRequest>(`${API_URL}/OrderRequest/changestatus/${id}`, { status });
};
