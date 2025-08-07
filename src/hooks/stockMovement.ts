import { useEffect, useState } from 'react';
import { StockMovement } from '@/entities/stockMovement';
import { getStockMovements, getStockMovementById, addStockMovement } from '@/services/stockMovement';
import { Result } from '@/utils/result';
import { useFetch } from '@/utils/useFetch';

type StockMovementFilters = {
  warehouseId?: number;
  shelveId?: number;
};

export const useGetStockMovements = (
  page: number = 1,
  pageSize: number = 10,
  filters: StockMovementFilters,
): Result<StockMovement[]> => {
  const [data, setData] = useState<StockMovement[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getStockMovements(page, pageSize, filters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar movimientos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page, pageSize, filters]);

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

export const useAddStockMovement = (props?: Partial<StockMovement>) =>
  useFetch<Partial<StockMovement>, StockMovement>(addStockMovement, props, { parseFieldError: true });
