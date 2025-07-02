import { Shelve } from './shelve';

export type Warehouse = {
  id: number;
  name: string;
  description: string;
  address: string;
  shelves: Shelve[];
};
