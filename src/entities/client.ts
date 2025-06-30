import { Zone } from './zone';

export type Client = {
  id: number;
  name: string;
  rut: string;
  razonSocial: string;
  address: string;
  mapsAddress: string;
  schedule: string;
  phone: string;
  contactName: string;
  email: string;
  observations: string;
  bank: string;
  bankAccount: string;
  loanedCrates: number;
  zone: Zone;
};
