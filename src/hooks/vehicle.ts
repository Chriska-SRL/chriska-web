import { useFetch } from './useFetch';
import { useMutation } from './useMutation';
import { Vehicle } from '@/entities/vehicle';
import {
  getAllVehicles,
  getVehicleById,
  getVehicleByPlate,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from '@/services/vehicle';

export const useGetVehicles = () => useFetch<Vehicle[]>(getAllVehicles);

export const useGetVehicleById = (id?: number) => useFetch<Vehicle>(() => getVehicleById(id!), [id]);

export const useGetVehicleByPlate = (plate?: string) => useFetch<Vehicle>(() => getVehicleByPlate(plate!), [plate]);

export const useAddVehicle = () => useMutation<Vehicle, Partial<Vehicle>>(addVehicle);

export const useUpdateVehicle = () => useMutation<Vehicle, Partial<Vehicle>>(updateVehicle);

export const useDeleteVehicle = () => useMutation<Vehicle, number>(deleteVehicle);
