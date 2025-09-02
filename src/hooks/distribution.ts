import { useState, useEffect } from 'react';
import { Distribution } from '@/entities/distribution';
import {
  getDistributions,
  getDistributionById,
  addDistribution,
  updateDistribution,
  deleteDistribution,
} from '@/services/distribution';
import { useFetch, useMutation } from '@/utils/useFetch';

type CreateDistributionData = {
  observations?: string;
  userId: number;
  vehicleId: number;
  zoneIds: number[];
  deliveryIds: number[];
};

type DistributionFilters = {
  id?: number;
  userId?: number;
  vehicleId?: number;
  date?: string;
};

export const useGetDistributions = (page: number = 1, pageSize: number = 10, filters?: DistributionFilters) => {
  const [data, setData] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const fetchDistributions = async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getDistributions(page, pageSize, filters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDistributions();
  }, [page, pageSize, filters]);

  return { data, isLoading, error };
};

export const useGetDistributionById = (id?: number) => useFetch<number, Distribution>(getDistributionById, id);

export const useAddDistribution = () =>
  useMutation<CreateDistributionData, Distribution>(addDistribution, { parseFieldError: true });

export const useUpdateDistribution = () =>
  useMutation<Partial<Distribution>, Distribution>(updateDistribution, { parseFieldError: true });

export const useDeleteDistribution = (id?: number) => useFetch<number, void>(deleteDistribution, id);
