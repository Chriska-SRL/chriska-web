import { Shelve } from '@/entities/shelve';
import { get, put, post, del } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getShelves = (): Promise<Shelve[]> => {
  return get<Shelve[]>(`${API_URL}/Shelves`);
};

export const addShelve = (shelve: Partial<Shelve>): Promise<Shelve> => {
  return post<Shelve>(`${API_URL}/Shelves`, shelve);
};

export const updateShelve = (shelve: Partial<Shelve>): Promise<Shelve> => {
  return put<Shelve>(`${API_URL}/Shelves`, shelve);
};

export const deleteShelve = (id: number): Promise<Shelve> => {
  return del<Shelve>(`${API_URL}/Shelves/${id}`);
};
