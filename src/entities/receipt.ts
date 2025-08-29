import { Client } from './client';

export type Receipt = {
  id: number;
  date: string;
  amount: number;
  notes: string;
  paymentMethod: string;
  client: Client;
};
