import { Client } from './client';
import { OrderRequest } from './orderRequest';
import { Product } from './product';
import { User } from './user';

export type Order = {
  id: number;
  client: Client;
  observations: string;
  status: string;
  date: string;
  confirmedDate: string;
  user: User;
  productItems: [
    {
      quantity: number;
      weight: number;
      unitPrice: number;
      discount: number;
      product: Product;
    },
  ];
  // delivery: null;
  crates: number;
  orderRequest: OrderRequest;
};
