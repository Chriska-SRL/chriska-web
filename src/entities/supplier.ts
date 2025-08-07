import { BankAccount } from './bankAccount';

export type Supplier = {
  id: number;
  name: string;
  rut: string;
  razonSocial: string;
  address: string;
  mapsAddress: string;
  phone: string;
  contactName: string;
  email: string;
  observations: string;
  bankAccounts: BankAccount[];
};
