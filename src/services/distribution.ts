import { Distribution } from '@/entities/distribution';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type DistributionFilters = {
  id?: number;
  userId?: number;
  vehicleId?: number;
  date?: string;
};

export const getDistributions = (
  page: number = 1,
  pageSize: number = 10,
  filters?: DistributionFilters,
): Promise<Distribution[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.id) {
    params.append('filters[Id]', filters.id.toString());
  }

  if (filters?.userId) {
    params.append('filters[UserId]', filters.userId.toString());
  }

  if (filters?.vehicleId) {
    params.append('filters[VehicleId]', filters.vehicleId.toString());
  }

  if (filters?.date) {
    params.append('filters[Date]', filters.date);
  }

  return get<Distribution[]>(`${API_URL}/Distribution?${params.toString()}`);
};

export const getDistributionById = (id: number): Promise<Distribution> => {
  return get<Distribution>(`${API_URL}/Distribution/${id}`);
};

export const addDistribution = (distribution: any): Promise<Distribution> => {
  return post<Distribution>(`${API_URL}/Distribution`, distribution);
};

export const updateDistribution = (distribution: Partial<Distribution>): Promise<Distribution> => {
  return put<Distribution>(`${API_URL}/Distribution/${distribution.id}`, distribution);
};

export const deleteDistribution = (id: number): Promise<void> => {
  return del(`${API_URL}/Distribution/${id}`);
};
