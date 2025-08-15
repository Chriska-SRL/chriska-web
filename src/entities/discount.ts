import { Brand } from './brand';
import { Client } from './client';
import { Product } from './product';
import { SubCategory } from './subcategory';
import { Zone } from './zone';

export type Discount = {
  id: string;
  description: string;
  expirationDate: string;
  productQuantity: number;
  percentage: number;
  status: string;
  products: Product[];
  clients: Client[];
  brand: Brand;
  subCategory: SubCategory;
  zone: Zone;
};
