import { Shelve } from '@/entities/shelve';
import { getShelves, addShelve, updateShelve, deleteShelve } from '@/services/shelve';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetShelves = () => useFetchNoParams<Shelve[]>(getShelves, []);

export const useAddShelve = (props?: Partial<Shelve>) =>
  useFetch<Partial<Shelve>, Shelve>(addShelve, props, { parseFieldError: true });

export const useUpdateShelve = (props?: Partial<Shelve>) =>
  useFetch<Partial<Shelve>, Shelve>(updateShelve, props, { parseFieldError: true });

export const useDeleteShelve = (id?: number) => useFetch<number, Shelve>(deleteShelve, id);
