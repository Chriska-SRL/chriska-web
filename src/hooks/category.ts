import { useEffect, useState } from 'react';
import { FieldError, Result } from './result';
import { Category } from '@/entities/category';
import { getCategories, addCategory, updateCategory, deleteCategory } from '@/services/category';

export const useGetCategories = (): Result<Category[]> => {
  const [data, setData] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getCategories();
        setData(result);
        setError(undefined);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
        setData([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

export const useAddCategory = (props?: Partial<Category>): Result<Category> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<Category>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addCategory(props);
          setData(result);
          setError(undefined);
          setFieldError(undefined);
        } catch (err: any) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.campo && parsed?.error) {
              setFieldError(parsed);
              setError(undefined);
            } else {
              setError(err.message || 'Error desconocido');
              setFieldError(undefined);
            }
          } catch {
            setError(err.message || 'Error desconocido');
            setFieldError(undefined);
          }
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [props]);

  return { data, isLoading, error, fieldError };
};

export const useUpdateCategory = (props?: Partial<Category>): Result<Category> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<Category>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await updateCategory(props);
          setData(result);
          setError(undefined);
          setFieldError(undefined);
        } catch (err: any) {
          try {
            const parsed = JSON.parse(err.message);
            if (parsed?.campo && parsed?.error) {
              setFieldError(parsed);
              setError(undefined);
            } else {
              setError(err.message || 'Error desconocido');
              setFieldError(undefined);
            }
          } catch {
            setError(err.message || 'Error desconocido');
            setFieldError(undefined);
          }
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [props]);

  return { data, isLoading, error, fieldError };
};

export const useDeleteCategory = (id?: number): Result<Category> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Category>();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await deleteCategory(id);
          setData(result);
        } catch (err: any) {
          try {
            const parsed = JSON.parse(err.message);
            setError(parsed.error || 'Error desconocido');
          } catch {
            setError(err.message || 'Error desconocido');
          }
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [id]);

  return { data, isLoading, error };
};
