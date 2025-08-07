import { Product } from './product';
import { User } from './user';

export type StockMovement = {
  id: number;
  date: string;
  quantity: number;
  type: string;
  reason: string;
  user: User;
  product: Product;
};
