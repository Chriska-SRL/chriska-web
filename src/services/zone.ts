import { Zone } from '@/entities/zone';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getZones = (): Promise<Zone[]> => {
  return get<Zone[]>(`${API_URL}/Zones`);
};

export const addZone = (zone: Partial<Zone>): Promise<Zone> => {
  return post<Zone>(`${API_URL}/Zones`, zone);
};

export const updateZone = (zone: Partial<Zone>): Promise<Zone> => {
  return put<Zone>(`${API_URL}/Zones`, zone);
};

export const deleteZone = (id: number): Promise<Zone> => {
  return del<Zone>(`${API_URL}/Zones/${id}`);
};
