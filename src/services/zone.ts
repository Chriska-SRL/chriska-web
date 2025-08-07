import { Zone } from '@/entities/zone';
import { get, put, post, del } from '@/utils/fetcher';
import { Day } from '@/enums/day.enum';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ZoneFilters = {
  name?: string;
  requestDay?: Day;
  deliveryDay?: Day;
};

export const getZones = (page: number = 1, pageSize: number = 10, filters?: ZoneFilters): Promise<Zone[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.name) {
    params.append('filters[Name]', filters.name);
  }

  if (filters?.requestDay) {
    params.append('filters[RequestDays]', filters.requestDay);
  }

  if (filters?.deliveryDay) {
    params.append('filters[DeliveryDays]', filters.deliveryDay);
  }

  return get<Zone[]>(`${API_URL}/Zones?${params.toString()}`);
};

export const getZoneById = (id: number): Promise<Zone> => {
  return get<Zone>(`${API_URL}/Zones/${id}`);
};

export const addZone = (zone: Partial<Zone>): Promise<Zone> => {
  return post<Zone>(`${API_URL}/Zones`, zone);
};

export const updateZone = (zone: Partial<Zone>): Promise<Zone> => {
  return put<Zone>(`${API_URL}/Zones/${zone.id}`, zone);
};

export const deleteZone = (id: number): Promise<Zone> => {
  return del<Zone>(`${API_URL}/Zones/${id}`);
};

export const uploadZoneImage = async (id: number, file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  return post<string>(`${API_URL}/Zones/${id}/upload-image`, formData);
};

export const deleteZoneImage = (id: number): Promise<void> => {
  return post<void>(`${API_URL}/Zones/${id}/delete-image`, undefined);
};
