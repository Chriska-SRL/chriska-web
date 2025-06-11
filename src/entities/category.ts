import { SubCategory } from './subcategory';

export type Category = {
  id: number;
  name: string;
  description: string;
  subCategories: SubCategory[];
};
