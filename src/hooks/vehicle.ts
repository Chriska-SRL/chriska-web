import { useState, useEffect } from 'react';
import { Vehicle } from '@/entities/vehicle';
import {
  addVehicle,
  deleteVehicle,
  getVehicleById,
  getVehicleByPlate,
  getVehicles,
  updateVehicle,
} from '@/services/vehicle';
import { useFetch } from '@/utils/useFetch';

export const useGetVehicles = (
  page: number = 1,
  pageSize: number = 10,
  filters?: { plate?: string; brand?: string; model?: string },
) => {
  const [data, setData] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchVehicles = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getVehicles(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, [page, pageSize, filters?.plate, filters?.brand, filters?.model]);

  return { data, isLoading, error };
};

export const useGetVehicleById = (id: number) => useFetch<number, Vehicle>(getVehicleById, id);

export const useGetVehicleByPlate = (plate: string) => useFetch<string, Vehicle>(getVehicleByPlate, plate);

export const useAddVehicle = (props?: Partial<Vehicle>) =>
  useFetch<Partial<Vehicle>, Vehicle>(addVehicle, props, { parseFieldError: true });

export const useUpdateVehicle = (props?: Partial<Vehicle>) =>
  useFetch<Partial<Vehicle>, Vehicle>(updateVehicle, props, { parseFieldError: true });

export const useDeleteVehicle = (id?: number) => useFetch<number, Vehicle>(deleteVehicle, id);
