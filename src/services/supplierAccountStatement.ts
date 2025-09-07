import { get } from '@/utils/fetcher';
import { SupplierAccountStatement } from '@/entities/supplierAccountStatement';
import { AccountStatementFilters } from '@/entities/accountStatement';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getSupplierAccountStatements = async (
  supplierId: number,
  filters?: AccountStatementFilters,
): Promise<SupplierAccountStatement> => {
  const params = new URLSearchParams();
  params.append('supplierId', supplierId.toString());

  if (filters?.fromDate) {
    params.append('fromDate', filters.fromDate);
  }
  if (filters?.toDate) {
    params.append('toDate', filters.toDate);
  }

  const url = `${API_URL}/SupplierAccountStatements/${supplierId}?${params.toString()}`;
  return await get<SupplierAccountStatement>(url);
};
