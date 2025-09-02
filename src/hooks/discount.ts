import { useState, useEffect, useMemo } from 'react';
import { Discount } from '@/entities/discount';
import { getDiscounts, addDiscount, updateDiscount, deleteDiscount } from '@/services/discount';
import { useFetch, useMutation } from '../utils/useFetch';

type DiscountFilters = {
  description?: string;
  status?: string;
  brandId?: number;
  subCategoryId?: number;
  zoneId?: number;
  clientId?: number;
  productId?: number;
};

export const useGetDiscounts = (page: number = 1, pageSize: number = 10, filters?: DiscountFilters) => {
  const [data, setData] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Memoize filters to prevent unnecessary re-renders
  const memoizedFilters = useMemo(
    () => filters,
    [
      filters?.description,
      filters?.status,
      filters?.brandId,
      filters?.subCategoryId,
      filters?.zoneId,
      filters?.clientId,
      filters?.productId,
    ],
  );

  useEffect(() => {
    const fetchDiscounts = async () => {
      setIsLoading(true);
      setError(undefined);

      try {
        const result = await getDiscounts(page, pageSize, memoizedFilters);
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscounts();
  }, [page, pageSize, memoizedFilters]);

  return { data, isLoading, error };
};

export const useAddDiscount = () =>
  useMutation<
    {
      description: string;
      expirationDate: string;
      productQuantity: number;
      percentage: number;
      status: string;
      discountProductId: number[];
      discountClientId: number[];
      brandId?: string;
      subCategoryId?: string;
      zoneId?: string;
    },
    Discount
  >(addDiscount, { parseFieldError: true });

export const useUpdateDiscount = () =>
  useMutation<
    {
      id: string;
      discount: {
        description?: string;
        expirationDate?: string;
        productQuantity?: number;
        percentage?: number;
        status?: string;
        discountProductId?: number[];
        discountClientId?: number[];
        brandId?: string;
        subCategoryId?: string;
        zoneId?: string;
      };
    },
    Discount
  >((data) => updateDiscount(data.id, data.discount), { parseFieldError: true });

export const useDeleteDiscount = (id?: string) => useFetch<string, Discount>(deleteDiscount, id);
