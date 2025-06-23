import { VehicleCostType } from './vehicleCostType';

export type VehicleCost = {
  id: number;
  vehicleId: number;
  date: string;
  type: VehicleCostType | '';
  amount: string;
  description: string;
};
