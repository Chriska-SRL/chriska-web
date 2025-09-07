import { BaseAccountStatement } from './accountStatement';

export type SupplierAccountStatement = BaseAccountStatement & {
  supplierId: number;
  supplierName: string;
};
