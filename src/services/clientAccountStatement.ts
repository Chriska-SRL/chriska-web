import { ClientAccountStatement } from '@/entities/clientAccountStatement';
import { get } from '@/utils/fetcher';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientAccountStatementFilters = {
  fromDate?: string;
  toDate?: string;
};

export const getClientAccountStatements = (
  clientId: number,
  filters?: ClientAccountStatementFilters,
): Promise<ClientAccountStatement> => {
  const params = new URLSearchParams();

  if (filters?.fromDate) {
    params.append('filters[FromDate]', filters.fromDate);
  }

  if (filters?.toDate) {
    params.append('filters[ToDate]', filters.toDate);
  }

  return get<ClientAccountStatement>(`${API_URL}/ClientAccountStatements/${clientId}?${params.toString()}`);
};
