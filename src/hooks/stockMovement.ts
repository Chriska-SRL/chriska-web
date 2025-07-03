import { useEffect, useState } from 'react';
import { StockMovement } from '@/entities/stockMovement';
import {
  getStockMovements,
  getStockMovementById,
  getStockMovementsByShelveId,
  getStockMovementsByWarehouseId,
  addStockMovement,
} from '@/services/stockMovement';
import { Result } from '@/utils/result';
import { useFetch } from '@/utils/useFetch';

export const useGetStockMovements = (from: string, to: string): Result<StockMovement[]> => {
  const [data, setData] = useState<StockMovement[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!from || !to) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getStockMovements({ from, to });
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar movimientos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [from, to]);

  return { data, isLoading, error };
};

export const useGetStockMovementsByShelveId = (shelveId: number, from: string, to: string): Result<StockMovement[]> => {
  const [data, setData] = useState<StockMovement[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!shelveId || shelveId === -1 || !from || !to) {
      setData(undefined);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getStockMovementsByShelveId({ id: shelveId, from, to });
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar movimientos por estantería');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [shelveId, from, to]);

  return { data, isLoading, error };
};

export const useGetStockMovementsByWarehouseId = (
  warehouseId: number,
  from: string,
  to: string,
): Result<StockMovement[]> => {
  const [data, setData] = useState<StockMovement[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!warehouseId || warehouseId === -1 || !from || !to) {
      setData(undefined);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getStockMovementsByWarehouseId({ id: warehouseId, from, to });
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al cargar movimientos por almacén');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [warehouseId, from, to]);

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
