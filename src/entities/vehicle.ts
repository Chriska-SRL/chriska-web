import { VehicleCost } from './vehicleCost';

export type Vehicle = {
  id: number;
  plate: string;
  brand: string;
  model: string;
  crateCapacity: number;
  costs: VehicleCost[];
};
