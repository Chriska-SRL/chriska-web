import { Client } from './client';
import { Product } from './product';
import { User } from './user';

export type ProductItem = {
  quantity: number;
  weight: number;
  unitPrice: number;
  discount: number;
  product: Product;
};

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
