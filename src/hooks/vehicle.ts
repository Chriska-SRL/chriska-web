import { Vehicle } from '@/entities/vehicle';
import {
  addVehicle,
  deleteVehicle,
  getVehicleById,
  getVehicleByPlate,
  getVehicles,
  updateVehicle,
} from '@/services/vehicle';
import { useFetch, useFetchNoParams } from '@/utils/useFetch';

export const useGetVehicles = () => useFetchNoParams<Vehicle[]>(getVehicles, []);

export const useGetVehicleById = (id: number) => useFetch<number, Vehicle>(getVehicleById, id);

export const useGetVehicleByPlate = (plate: string) => useFetch<string, Vehicle>(getVehicleByPlate, plate);

export const useAddVehicle = (props?: Partial<Vehicle>) =>
  useFetch<Partial<Vehicle>, Vehicle>(addVehicle, props, { parseFieldError: true });

export const useUpdateVehicle = (props?: Partial<Vehicle>) =>
  useFetch<Partial<Vehicle>, Vehicle>(updateVehicle, props, { parseFieldError: true });

export const useDeleteVehicle = (id?: number) => useFetch<number, Vehicle>(deleteVehicle, id);
