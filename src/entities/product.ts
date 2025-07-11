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
  availableStock: number;
  unitType: string;
  description: string;
  temperatureCondition: string;
  observation: string;
  subCategory: SubCategory;
  brand: Brand;
  suppliers: Supplier[];
};
