import { Zone } from '@/entities/zone';
import {
  getZones,
  addZone,
  updateZone,
  deleteZone,
  getZoneById,
  uploadZoneImage,
  deleteZoneImage,
} from '@/services/zone';
import { useFetch } from '../utils/useFetch';
import { useState, useEffect } from 'react';
import { Day } from '@/enums/day.enum';

export const useGetZones = (
  page: number = 1,
  pageSize: number = 10,
  filterName?: string,
  filterRequestDay?: Day | '',
  filterDeliveryDay?: Day | '',
) => {
  const [data, setData] = useState<Zone[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchZones = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const filters: any = {};
        if (filterName) filters.name = filterName;
        if (filterRequestDay) filters.requestDay = filterRequestDay;
        if (filterDeliveryDay) filters.deliveryDay = filterDeliveryDay;

        const hasFilters = Object.keys(filters).length > 0;
        const result = await getZones(page, pageSize, hasFilters ? filters : undefined);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchZones();
  }, [page, pageSize, filterName, filterRequestDay, filterDeliveryDay]);

  return { data, isLoading, error };
};

export const useGetZoneById = (id?: number) => useFetch<number, Zone>(getZoneById, id);

export const useAddZone = (props?: Partial<Zone>) =>
  useFetch<Partial<Zone>, Zone>(addZone, props, { parseFieldError: true });

export const useUpdateZone = (props?: Partial<Zone>) =>
  useFetch<Partial<Zone>, Zone>(updateZone, props, { parseFieldError: true });

export const useDeleteZone = (id?: number) => useFetch<number, Zone>(deleteZone, id);

export const useUploadZoneImage = (props?: { id: number; file: File }) =>
  useFetch<{ id: number; file: File }, string>(({ id, file }) => uploadZoneImage(id, file), props);

export const useDeleteZoneImage = (id?: number) => useFetch<number, void>(deleteZoneImage, id);
