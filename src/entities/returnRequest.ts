import { Client } from './client';
import { Delivery } from './delivery';
import { ProductItem } from './productItem';
import { User } from './user';

export type ReturnRequest = {
  id: number;
  client: Client;
  status: string;
  date: string;
  confirmedDate: string;
  observations: string;
  user: User;
  productItems: ProductItem[];
  delivery: Delivery;
};
