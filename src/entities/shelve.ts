import { Stock } from './stock';
import { StockMovement } from './stockMovement';
import { Warehouse } from './warehouse';

export type Shelve = {
  id: number;
  name: string;
  description: string;
  warehouse: Warehouse;
  stocks: Stock[];
  stockMovements: StockMovement[];
};
