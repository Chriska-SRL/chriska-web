import { useFetch } from './useFetch';
import { useMutation } from './useMutation';
import { VehicleCost } from '@/entities/vehicleCost';
import {
  getVehicleCosts,
  getVehicleCostById,
  getCostsInRange,
  addVehicleCost,
  updateVehicleCost,
  deleteVehicleCost,
} from '@/services/vehicleCost';

export const useGetVehicleCosts = (vehicleId?: number) =>
  useFetch<VehicleCost[]>(() => getVehicleCosts(vehicleId!), [vehicleId]);

export const useGetVehicleCostById = (id?: number) =>
  useFetch<VehicleCost>(() => getVehicleCostById(id!), [id]);

export const useGetVehicleCostsInRange = (
  vehicleId?: number,
  from?: Date,
  to?: Date
) =>
  useFetch<VehicleCost[]>(
    () => getCostsInRange(vehicleId!, from!, to!),
    [vehicleId, from, to]
  );

export const useAddVehicleCost = () =>
  useMutation<VehicleCost, Partial<VehicleCost>>(addVehicleCost);

export const useUpdateVehicleCost = () =>
  useMutation<VehicleCost, Partial<VehicleCost>>(updateVehicleCost);

export const useDeleteVehicleCost = () =>
  useMutation<VehicleCost, number>(deleteVehicleCost);
