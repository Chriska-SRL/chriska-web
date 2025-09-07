import { BaseAccountStatement } from './accountStatement';

export type ClientAccountStatement = BaseAccountStatement & {
  clientId: number;
  clientName: string;
};
