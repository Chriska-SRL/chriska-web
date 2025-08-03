import { Brand } from './brand';
import { SubCategory } from './subcategory';
import { Supplier } from './supplier';

export type Product = {
  id: number;
  internalCode: string;
  barcode: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  availableStock: number;
  unitType: string;
  description: string;
  temperatureCondition: string;
  observations: string;
  subCategory: SubCategory;
  brand: Brand;
  suppliers: Supplier[];
  // discounts: Discount[];
};
