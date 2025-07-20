import { UnitType } from '@/enums/unitType.enum';
import { Brand } from './brand';
import { SubCategory } from './subcategory';
import { Supplier } from './supplier';
import { TemperatureCondition } from '@/enums/temperatureCondition';

export type Product = {
  id: number;
  internalCode: string;
  barcode: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
  availableStock: number;
  unitType: UnitType;
  description: string;
  temperatureCondition: TemperatureCondition;
  observation: string;
  subCategory: SubCategory;
  brand: Brand;
  suppliers: Supplier[];
  // discounts: Discount[];
};
