import { Client } from './client';
import { ProductItem } from './productItem';
import { User } from './user';

export type OrderRequest = {
  id: number;
  observations: string;
  date: string;
  confirmedDate: string;
  status: string;
  user: User;
  client: Client;
  productItems: ProductItem[];
};
