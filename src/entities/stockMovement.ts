import { Product } from './product';
import { Shelve } from './shelve';
import { User } from './user';

export type StockMovement = {
  id: number;
  date: string;
  quantity: number;
  type: string;
  reason: string;
  shelve: Shelve;
  user: User;
  product: Product;
};
