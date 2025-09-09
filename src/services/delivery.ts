import { Delivery } from '@/entities/delivery';
import { get, put } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DeliveryFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const getDeliveries = (
  page: number = 1,
  pageSize: number = 10,
  filters?: DeliveryFilters,
): Promise<Delivery[]> => {
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

  return get<Delivery[]>(`${API_URL}/Delivery?${params.toString()}`);
};

export const getDeliveryById = (id: number): Promise<Delivery> => {
  return get<Delivery>(`${API_URL}/Delivery/${id}`);
};

export const updateDelivery = (delivery: Partial<Delivery>): Promise<Delivery> => {
  return put<Delivery>(`${API_URL}/Delivery/${delivery.id}`, delivery);
};

export const changeDeliveryStatus = (
  id: number,
  status: string,
  additionalData?: {
    amount?: number;
    paymentMethod?: string | null;
    crates?: number;
  },
): Promise<Delivery> => {
  const payload = {
    status,
    ...additionalData,
  };
  return put<Delivery>(`${API_URL}/Delivery/changestatus/${id}`, payload);
};

export const getConfirmedDeliveriesByClient = (clientId: number): Promise<Delivery[]> => {
  return get<Delivery[]>(`${API_URL}/Delivery/client/${clientId}/confirmed`);
};
