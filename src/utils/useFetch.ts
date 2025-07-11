import { useEffect, useState } from 'react';
import { FieldError, Result } from './result';

type AsyncFn<P, R> = (params: P) => Promise<R>;

export const useFetch = <P = void, R = unknown>(
  fn: AsyncFn<P, R>,
  params?: P,
  options?: { parseFieldError?: boolean },
): Result<R> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<R>();

  useEffect(() => {
    const shouldRun = typeof params !== 'undefined' || (params === undefined && fn.length === 0);

    if (shouldRun) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await fn(params as P);
          setData(result);
          setError(undefined);
          setFieldError(undefined);
        } catch (err: any) {
          try {
            const parsed = JSON.parse(err.message);
            if (options?.parseFieldError && parsed?.campo && parsed?.error) {
              setFieldError(parsed);
              setError(undefined);
            } else {
              setError(parsed.error || err.message || 'Error desconocido');
            }
          } catch {
            setError(err.message || 'Error desconocido');
          }
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [params, fn]);

  return { data, isLoading, error, fieldError };
};

export const useFetchNoParams = <T>(fn: () => Promise<T>, defaultValue: T): Result<T> => {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fn();
        setData(result);
        setError(undefined);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
        setData(defaultValue);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};
