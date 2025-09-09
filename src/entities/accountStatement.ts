export type AccountStatementItem = {
  id: number;
  date: string;
  description: string;
  amount: number;
  balance: number;
  documentType: string;
};

export type BaseAccountStatement = {
  totalBalance: string;
  items: AccountStatementItem[];
};

export type AccountStatementEntity = 'client' | 'supplier';

export type AccountStatementFilters = {
  fromDate?: string;
  toDate?: string;
};
