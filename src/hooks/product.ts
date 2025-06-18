import { Product } from '@/entities/product';
import { getProducts, addProduct, updateProduct, deleteProduct } from '@/services/product';
import { useFetch, useFetchNoParams } from '../utils/useFetch';

export const useGetProducts = () => useFetchNoParams<Product[]>(getProducts, []);

export const useAddProduct = (props?: Partial<Product>) =>
  useFetch<Partial<Product>, Product>(addProduct, props, { parseFieldError: true });

export const useUpdateProduct = (props?: Partial<Product>) =>
  useFetch<Partial<Product>, Product>(updateProduct, props, { parseFieldError: true });

export const useDeleteProduct = (id?: number) => useFetch<number, Product>(deleteProduct, id);
