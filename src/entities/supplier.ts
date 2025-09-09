import { BankAccount } from './bankAccount';

export type Supplier = {
  id: number;
  name: string;
  rut: string;
  razonSocial: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  phone: string;
  contactName: string;
  email: string;
  observations: string;
  bankAccounts: BankAccount[];
};
