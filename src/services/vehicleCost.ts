import { get, post, put, del } from '@/utils/fetcher';
import { VehicleCost } from '@/entities/vehicleCost';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type VehicleCostsInRangeProps = {
  vehicleId: number;
  from: Date;
  to: Date;
};

export const getVehicleCosts = (vehicleId: number): Promise<VehicleCost[]> =>
  get<VehicleCost[]>(`${API_URL}/VehicleCosts/vehicle/${vehicleId}`);

export const getVehicleCostById = (id: number): Promise<VehicleCost> =>
  get<VehicleCost>(`${API_URL}/VehicleCosts/${id}`);

export const getVehicleCostsInRange = (props: VehicleCostsInRangeProps): Promise<VehicleCost[]> =>
  get<VehicleCost[]>(
    `${API_URL}/VehicleCosts/vehicle/${props.vehicleId}/rango?from=${props.from.toISOString()}&to=${props.to.toISOString()}`,
    true,
  );

export const addVehicleCost = (vehicleCost: Partial<VehicleCost>): Promise<VehicleCost> =>
  post<VehicleCost>(`${API_URL}/VehicleCosts`, vehicleCost);

export const updateVehicleCost = (vehicleCost: Partial<VehicleCost>): Promise<VehicleCost> =>
  put<VehicleCost>(`${API_URL}/VehicleCosts`, vehicleCost);

export const deleteVehicleCost = (id: number): Promise<VehicleCost> =>
  del<VehicleCost>(`${API_URL}/VehicleCosts/${id}`);
