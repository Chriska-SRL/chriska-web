import { ReturnRequest } from '@/entities/returnRequest';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ReturnRequestFilters = {
  status?: string;
  clientId?: number;
  userId?: number;
  fromDate?: string;
  toDate?: string;
};

export const getReturnRequests = (
  page: number = 1,
  pageSize: number = 10,
  filters?: ReturnRequestFilters,
): Promise<ReturnRequest[]> => {
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

  return get<ReturnRequest[]>(`${API_URL}/ReturnRequest?${params.toString()}`);
};

export const getReturnRequestById = (id: number): Promise<ReturnRequest> => {
  return get<ReturnRequest>(`${API_URL}/ReturnRequest/${id}`);
};

export const createReturnRequest = (returnRequest: any): Promise<ReturnRequest> => {
  return post<ReturnRequest>(`${API_URL}/ReturnRequest`, returnRequest);
};

export const updateReturnRequest = (returnRequest: Partial<ReturnRequest>): Promise<ReturnRequest> => {
  return put<ReturnRequest>(`${API_URL}/ReturnRequest/${returnRequest.id}`, returnRequest);
};

export const deleteReturnRequest = (id: number): Promise<void> => {
  return del(`${API_URL}/ReturnRequest/${id}`);
};

export const changeReturnRequestStatus = (id: number, status: string): Promise<ReturnRequest> => {
  return put<ReturnRequest>(`${API_URL}/ReturnRequest/changestatus/${id}`, { status });
};
