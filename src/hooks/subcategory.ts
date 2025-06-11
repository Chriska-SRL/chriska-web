import { useEffect, useState } from 'react';
import { Result } from './result';
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

export const useAddSubCategory = (props?: SubCategory): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addSubCategory(props);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };

      fetchData();
    }
  }, [props]);

  return { data, isLoading, error };
};

export const useUpdateSubCategory = (props?: SubCategory): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await updateSubCategory(props);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Error desconocido');
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [props]);

  return { data, isLoading, error };
};

export const useDeleteSubCategory = (id?: number): Result<boolean> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<boolean>();

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
