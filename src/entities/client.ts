import { BankAccount } from './bankAccount';
import { Zone } from './zone';

export type Client = {
  id: number;
  name: string;
  rut: string;
  razonSocial: string;
  address: string;
  mapsAddress: string;
  phone: string;
  email: string;
  contactName: string;
  schedule: string;
  loanedCrates: number;
  observations: string;
  qualification: string;
  bankAccounts: BankAccount[];
  zone: Zone;
};
