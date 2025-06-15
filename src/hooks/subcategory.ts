import { useEffect, useState } from 'react';
import { FieldError, Result } from './result';
import { SubCategory } from '@/entities/subcategory';
import { getSubCategories, addSubCategory, updateSubCategory, deleteSubCategory } from '@/services/subcategory';

export const useGetSubCategories = (): Result<SubCategory[]> => {
  const [data, setData] = useState<SubCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getSubCategories();
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

export const useAddSubCategory = (props?: Partial<SubCategory>): Result<SubCategory> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<SubCategory>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addSubCategory(props);
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

export const useUpdateSubCategory = (props?: Partial<SubCategory>): Result<SubCategory> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<SubCategory>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await updateSubCategory(props);
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

export const useDeleteSubCategory = (id?: number): Result<SubCategory> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<SubCategory>();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await deleteSubCategory(id);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [id]);

  return { data, isLoading, error };
};
