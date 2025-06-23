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

export const useGetVehicleCosts = (vehicleId: number) => useFetch<number, VehicleCost[]>(getVehicleCosts, vehicleId);

export const useGetVehicleCostById = (id: number) => useFetch<number, VehicleCost>(getVehicleCostById, id);

export const useGetVehicleCostsInRange = (props: VehicleCostsInRangeProps) =>
  useFetch<VehicleCostsInRangeProps, VehicleCost[]>(getVehicleCostsInRange, props);

export const useAddVehicleCost = (props?: Partial<VehicleCost>) =>
  useFetch<Partial<VehicleCost>, VehicleCost>(addVehicleCost, props, { parseFieldError: true });

export const useUpdateVehicleCost = (props?: Partial<VehicleCost>) =>
  useFetch<Partial<VehicleCost>, VehicleCost>(updateVehicleCost, props, { parseFieldError: true });

export const useDeleteVehicleCost = (id?: number) => useFetch<number, VehicleCost>(deleteVehicleCost, id);
