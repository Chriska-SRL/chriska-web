import { get, post, put, del } from '@/utils/fetcher';
import { VehicleCost } from '@/entities/vehicleCost';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type VehicleCostsInRangeProps = {
  vehicleId: number;
  from: Date;
  to: Date;
};

type VehicleCostFilters = {
  type?: string;
  from?: string;
  to?: string;
};

export const getVehicleCosts = (
  vehicleId: number,
  page: number = 1,
  pageSize: number = 10,
  filters?: VehicleCostFilters,
): Promise<VehicleCost[]> => {
  const params = new URLSearchParams();
  params.append('Page', page.toString());
  params.append('PageSize', pageSize.toString());
  params.append('filters[VehicleId]', vehicleId.toString());

  if (filters?.type) {
    params.append('filters[Type]', filters.type);
  }

  if (filters?.from) {
    params.append('filters[DateFrom]', filters.from);
  }

  if (filters?.to) {
    params.append('filters[DateTo]', filters.to);
  }

  return get<VehicleCost[]>(`${API_URL}/VehicleCosts?${params.toString()}`);
};

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
  put<VehicleCost>(`${API_URL}/VehicleCosts/${vehicleCost.id}`, vehicleCost);

export const deleteVehicleCost = (id: number): Promise<VehicleCost> =>
  del<VehicleCost>(`${API_URL}/VehicleCosts/${id}`);
