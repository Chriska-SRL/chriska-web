import { VehicleCostType } from './vehicleCostType';

export type VehicleCost = {
  id: number;
  vehicleId: number;
  date: string;
  costType: VehicleCostType | '';
  amount: string;
  description: string;
  type?: string;
};
