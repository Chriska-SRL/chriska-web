import { Client } from './client';
import { Order } from './order';
import { ProductItem } from './productItem';
import { User } from './user';

export type Delivery = {
  id: number;
  client: Client;
  status: string;
  date: string;
  confirmedDate: string;
  observations: string;
  user: User;
  productItems: ProductItem[];
  crates: number;
  order: Order;
};
