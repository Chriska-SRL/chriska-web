import { Category } from './category';

export type SubCategory = {
  id: number;
  name: string;
  description: string;
  category: Category;
};
