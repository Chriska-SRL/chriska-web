import { Order } from '@/entities/order';
import { get, put } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type OrderFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const getOrders = (page: number = 1, pageSize: number = 10, filters?: OrderFilters): Promise<Order[]> => {
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
    params.append('filters[FromDate]', filters.fromDate);
  }

  if (filters?.toDate) {
    params.append('filters[ToDate]', filters.toDate);
  }

  return get<Order[]>(`${API_URL}/Order?${params.toString()}`);
};

export const getOrderById = (id: number): Promise<Order> => {
  return get<Order>(`${API_URL}/Order/${id}`);
};

export const updateOrder = (order: Partial<Order>): Promise<Order> => {
  return put<Order>(`${API_URL}/Order/${order.id}`, order);
};

export const changeOrderStatus = (id: number, status: string): Promise<Order> => {
  return put<Order>(`${API_URL}/Order/changestatus/${id}`, { status });
};
