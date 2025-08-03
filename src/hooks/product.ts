import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/entities/product';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadProductImage, deleteProductImage } from '@/services/product';
import { useFetch } from '../utils/useFetch';

type ProductFilters = {
  name?: string;
  internalCode?: string;
  barcode?: string;
  unitType?: string;
  brandId?: number;
  categoryId?: number;
  subCategoryId?: number;
};

export const useGetProducts = (page: number = 1, pageSize: number = 10, filters?: ProductFilters) => {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [
    filters?.name,
    filters?.internalCode, 
    filters?.barcode,
    filters?.unitType,
    filters?.brandId,
    filters?.categoryId,
    filters?.subCategoryId
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getProducts(page, pageSize, memoizedFilters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useAddProduct = (props?: Partial<Product>) =>
  useFetch<Partial<Product>, Product>(addProduct, props, { parseFieldError: true });

export const useUpdateProduct = (props?: Partial<Product>) =>
  useFetch<Partial<Product>, Product>(updateProduct, props, { parseFieldError: true });

export const useDeleteProduct = (id?: number) => useFetch<number, Product>(deleteProduct, id);

export const useUploadProductImage = (props?: { id: number; file: File }) =>
  useFetch<{ id: number; file: File }, string>(
    ({ id, file }) => uploadProductImage(id, file),
    props
  );

export const useDeleteProductImage = (id?: number) => useFetch<number, void>(deleteProductImage, id);
