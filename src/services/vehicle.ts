import { get, post, put, del } from '@/utils/fetcher';
import { Vehicle } from '@/entities/vehicle';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type VehicleFilters = {
  plate?: string;
  brand?: string;
  model?: string;
};

export const getVehicles = (page: number = 1, pageSize: number = 10, filters?: VehicleFilters): Promise<Vehicle[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());

  if (filters?.plate) {
    params.append('filters[Plate]', filters.plate);
  }

  if (filters?.brand) {
    params.append('filters[Brand]', filters.brand);
  }

  if (filters?.model) {
    params.append('filters[Model]', filters.model);
  }

  return get<Vehicle[]>(`${API_URL}/Vehicles?${params.toString()}`);
};

export const getVehicleById = (id: number): Promise<Vehicle> => get<Vehicle>(`${API_URL}/Vehicles/${id}`);

export const getVehicleByPlate = (plate: string): Promise<Vehicle> =>
  get<Vehicle>(`${API_URL}/Vehicles/matricula/${plate}`);

export const addVehicle = (vehicle: Partial<Vehicle>): Promise<Vehicle> =>
  post<Vehicle>(`${API_URL}/Vehicles`, vehicle);

export const updateVehicle = (vehicle: Partial<Vehicle>): Promise<Vehicle> =>
  put<Vehicle>(`${API_URL}/Vehicles/${vehicle.id}`, vehicle);

export const deleteVehicle = (id: number): Promise<Vehicle> => del<Vehicle>(`${API_URL}/Vehicles/${id}`);
