import { useState, useEffect, useMemo } from 'react';
import { ClientAccountStatement } from '@/entities/clientAccountStatement';
import { getClientAccountStatements } from '@/services/clientAccountStatement';

type ClientAccountStatementFilters = {
  fromDate?: string;
  toDate?: string;
};

export const useGetClientAccountStatements = (clientId: number, filters?: ClientAccountStatementFilters) => {
  const [data, setData] = useState<ClientAccountStatement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters?.fromDate, filters?.toDate]);

  const fetchClientAccountStatements = async () => {
    if (!clientId) {
      setData(null);
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await getClientAccountStatements(clientId, memoizedFilters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClientAccountStatements();
  }, [clientId, memoizedFilters]);

  return { data, isLoading, error };
};
