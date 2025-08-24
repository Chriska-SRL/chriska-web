import { useState, useEffect } from 'react';
import { VehicleCost } from '@/entities/vehicleCost';
import {
  addVehicleCost,
  deleteVehicleCost,
  getVehicleCostById,
  getVehicleCosts,
  getVehicleCostsInRange,
  updateVehicleCost,
} from '@/services/vehicleCost';
import { useFetch } from '@/utils/useFetch';

type VehicleCostsInRangeProps = {
  vehicleId: number;
  from: Date;
  to: Date;
};

export const useGetVehicleCosts = (
  vehicleId: number,
  page: number = 1,
  pageSize: number = 10,
  filters?: { type?: string; description?: string; from?: string; to?: string },
) => {
  const [data, setData] = useState<VehicleCost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchVehicleCosts = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getVehicleCosts(vehicleId, page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleCosts();
  }, [vehicleId, page, pageSize, filters?.type, filters?.description, filters?.from, filters?.to]);

  return { data, isLoading, error };
};

export const useGetVehicleCostById = (id: number) => useFetch<number, VehicleCost>(getVehicleCostById, id);

export const useGetVehicleCostsInRange = (props: VehicleCostsInRangeProps) =>
  useFetch<VehicleCostsInRangeProps, VehicleCost[]>(getVehicleCostsInRange, props);

export const useAddVehicleCost = (props?: Partial<VehicleCost>) =>
  useFetch<Partial<VehicleCost>, VehicleCost>(addVehicleCost, props, { parseFieldError: true });

export const useUpdateVehicleCost = (props?: Partial<VehicleCost>) =>
  useFetch<Partial<VehicleCost>, VehicleCost>(updateVehicleCost, props, { parseFieldError: true });

export const useDeleteVehicleCost = (id?: number) => useFetch<number, VehicleCost>(deleteVehicleCost, id);
