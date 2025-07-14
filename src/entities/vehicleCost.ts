import { VehicleCostType } from '../enums/vehicleCostType.enum';

export type VehicleCost = {
  id: number;
  vehicleId: number;
  date: string;
  type: VehicleCostType | '';
  amount: string;
  description: string;
};
