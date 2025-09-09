import { Client } from './client';

export type ClientReceipt = {
  id: number;
  date: string;
  amount: number;
  notes: string;
  paymentMethod: string;
  client: Client;
};
