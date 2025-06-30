import { Zone } from '@/entities/zone';
import { getZones, addZone, updateZone, deleteZone } from '@/services/zone';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetZones = () => useFetchNoParams<Zone[]>(getZones, []);

export const useAddZone = (props?: Partial<Zone>) =>
  useFetch<Partial<Zone>, Zone>(addZone, props, { parseFieldError: true });

export const useUpdateZone = (props?: Partial<Zone>) =>
  useFetch<Partial<Zone>, Zone>(updateZone, props, { parseFieldError: true });

export const useDeleteZone = (id?: number) => useFetch<number, Zone>(deleteZone, id);
