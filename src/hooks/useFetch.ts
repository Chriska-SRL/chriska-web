// hooks/useFetch.ts
import { useEffect, useState } from 'react';

export function useFetch<T>(fetchFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ error: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
        setError(undefined);
      } catch (err: any) {
        setError({ error: err?.message || 'Error desconocido' });
        setData(null);
      }
      setIsLoading(false);
    };

    fetchData();
  }, deps); // ← permite dependencias externas

  return { data, isLoading, error };
}
