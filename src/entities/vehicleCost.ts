import { Vehicle } from './vehicle';

export type VehicleCost = {
  id: number;
  vehicleId: Vehicle;
  date: Date;
  type: string;
  amount: string;
  description: string;
};
