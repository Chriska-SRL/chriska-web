import { Brand } from './brand';
import { SubCategory } from './subcategory';
import { Supplier } from './supplier';

export type Product = {
  id: number;
  internalCode: string;
  barcode: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  unitType: string;
  description: string;
  temperatureCondition: string;
  observation: string;
  subCategory: SubCategory;
  suppliers: Supplier[];
  brand: Brand;
};
