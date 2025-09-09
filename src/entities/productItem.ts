import { Product } from './product';

export type ProductItem = {
  quantity: number;
  weight: number;
  unitPrice: number;
  discount: number;
  product: Product;
};
