import { get, post, put, del } from '@/utils/fetcher';
import { Vehicle } from '@/entities/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getAllVehicles = (): Promise<Vehicle[]> => get<Vehicle[]>(`${API_URL}/Vehicles`, true);

export const getVehicleById = (id: number): Promise<Vehicle> => get<Vehicle>(`${API_URL}/Vehicles/${id}`, true);

export const getVehicleByPlate = (plate: string): Promise<Vehicle> =>
  get<Vehicle>(`${API_URL}/Vehicles/matricula/${plate}`, true);

export const addVehicle = (vehicle: Partial<Vehicle>): Promise<Vehicle> =>
  post<Vehicle>(`${API_URL}/Vehicles`, vehicle, true);

export const updateVehicle = (vehicle: Partial<Vehicle>): Promise<Vehicle> =>
  put<Vehicle>(`${API_URL}/Vehicles`, vehicle, true);

export const deleteVehicle = (id: number): Promise<Vehicle> => del<Vehicle>(`${API_URL}/Vehicles/${id}`, true);
