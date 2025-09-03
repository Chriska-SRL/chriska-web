import { Supplier } from './supplier';

export type SupplierReceipt = {
  id: number;
  date: string;
  amount: number;
  notes: string;
  paymentMethod: string;
  supplier: Supplier;
};
