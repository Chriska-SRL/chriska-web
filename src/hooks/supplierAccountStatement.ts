import { useState, useEffect, useMemo } from 'react';
import { SupplierAccountStatement } from '@/entities/supplierAccountStatement';
import { AccountStatementFilters } from '@/entities/accountStatement';
import { getSupplierAccountStatements } from '@/services/supplierAccountStatement';

export const useGetSupplierAccountStatements = (supplierId: number, filters?: AccountStatementFilters) => {
  const [data, setData] = useState<SupplierAccountStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters?.fromDate, filters?.toDate]);

  const fetchSupplierAccountStatements = async () => {
    if (!supplierId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getSupplierAccountStatements(supplierId, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplierAccountStatements();
  }, [supplierId, memoizedFilters]);

  return { data, isLoading, error };
};
