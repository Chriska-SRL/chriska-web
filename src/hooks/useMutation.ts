import { useState } from 'react';
import { useAppToast } from '@/hooks/useAppToast';

type UnifiedError = { field?: string; error: string };
type MutationOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: UnifiedError) => void;
};

export const useMutation = <TResponse, TParams = void>(
  fn: (params: TParams) => Promise<TResponse>
) => {
  const [data, setData] = useState<TResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UnifiedError>();
  const toast = useAppToast();

  const parseError = (err: any): UnifiedError => {
    try {
      const parsed = JSON.parse(err.message);
      return {
        field: parsed.campo ?? parsed.field,
        error: parsed.error ?? 'Error desconocido',
      };
    } catch {
      return { error: err.message || 'Error desconocido' };
    }
  };

  const mutate = async (params: TParams, options?: MutationOptions<TResponse>) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await fn(params);
      setData(result);
      toast.showSuccess('Operación exitosa');
      options?.onSuccess?.(result);
    } catch (err: any) {
      const parsedError = parseError(err);
      setError(parsedError);
      toast.showError(parsedError);
      options?.onError?.(parsedError);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, mutate };
};
