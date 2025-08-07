import { Shelve } from './shelve';

export type Warehouse = {
  id: number;
  name: string;
  description: string;
  shelves: Shelve[];
};
