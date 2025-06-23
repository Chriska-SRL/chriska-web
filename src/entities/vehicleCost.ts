import { Vehicle } from './vehicle';

export type VehicleCost = {
  id: number;
  vehicle: Vehicle;
  date: Date;
  type: string;
  amount: string;
  description: string;
};
