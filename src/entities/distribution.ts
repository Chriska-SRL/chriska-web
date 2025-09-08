import { Delivery } from './delivery';
import { User } from './user';
import { Vehicle } from './vehicle';
import { Zone } from './zone';

export type Distribution = {
  id: number;
  observations: string;
  user: User;
  vehicle: Vehicle;
  zones: Zone[];
  deliveries: Delivery[];
  total: number;
  payments: number;
  crates: number;
  returnedCrates: number;
};
