import { ProductItem } from './productItem';
import { Supplier } from './supplier';

export type Purchase = {
  id: number;
  observations: string;
  invoiceNumber: string;
  date: string;
  supplier: Supplier;
  productItems: ProductItem[];
  status: string;
};
