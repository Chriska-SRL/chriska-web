import { useEffect, useState } from 'react';
import { useAppToast } from '@/hooks/useAppToast';

type FetchError = { error: string };

export function useFetch<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<FetchError>();
  const toast = useAppToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
        setError(undefined);
      } catch (err: any) {
        const parsedError = err?.message || 'Error desconocido';
        setError({ error: parsedError });
        setData(null);
        toast.showError({ error: parsedError });
      }
      setIsLoading(false);
    };

    fetchData();
  }, deps);

  return { data, isLoading, error };
}
