import { useEffect, useState, useMemo } from 'react';
import { StockMovement } from '@/entities/stockMovement';
import { getStockMovements, getStockMovementById, addStockMovement } from '@/services/stockMovement';
import { Result } from '@/utils/result';
import { useMutation } from '@/utils/useFetch';

type StockMovementFilters = {
  Type?: string;
  DateFrom?: string;
  DateTo?: string;
  ProductId?: number;
  CreatedBy?: number;
};

export const useGetStockMovements = (
  page: number = 1,
  pageSize: number = 10,
  filters: StockMovementFilters,
): Result<StockMovement[]> => {
  const [data, setData] = useState<StockMovement[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [filters.Type, filters.DateFrom, filters.DateTo, filters.ProductId, filters.CreatedBy],
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getStockMovements(page, pageSize, memoizedFilters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar movimientos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useGetStockMovementById = (id: number): Result<StockMovement> => {
  const [data, setData] = useState<StockMovement>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!id || id === -1) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getStockMovementById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar movimiento');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, isLoading, error };
};

export const useAddStockMovement = () =>
  useMutation<Partial<StockMovement>, StockMovement>(addStockMovement, { parseFieldError: true });
