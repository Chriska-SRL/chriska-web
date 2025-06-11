import { SubCategory } from './subcategory';

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
};
