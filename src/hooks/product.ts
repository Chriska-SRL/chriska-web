import { useEffect, useState } from 'react';
import { FieldError, Result } from './result';
import { Product } from '@/entities/product';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/services/product';

export const useGetProducts = (): Result<Product[]> => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await getProducts();
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

export const useAddProduct = (props?: Partial<Product>): Result<Product> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<Product>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await addProduct(props);
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

export const useUpdateProduct = (props?: Partial<Product>): Result<Product> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [fieldError, setFieldError] = useState<FieldError>();
  const [data, setData] = useState<Product>();

  useEffect(() => {
    if (props) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await updateProduct(props);
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

export const useDeleteProduct = (id?: number): Result<Product> => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Product>();

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const result = await deleteProduct(id);
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
