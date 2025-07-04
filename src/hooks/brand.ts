import { Brand } from '@/entities/brand';
import { getBrands, addBrand, updateBrand, deleteBrand } from '@/services/brand';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetBrands = () => useFetchNoParams<Brand[]>(getBrands, []);

export const useAddBrand = (props?: Partial<Brand>) =>
  useFetch<Partial<Brand>, Brand>(addBrand, props, { parseFieldError: true });

export const useUpdateBrand = (props?: Partial<Brand>) =>
  useFetch<Partial<Brand>, Brand>(updateBrand, props, { parseFieldError: true });

export const useDeleteBrand = (id?: number) => useFetch<number, Brand>(deleteBrand, id);
