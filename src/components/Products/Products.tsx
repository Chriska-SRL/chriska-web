'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ProductFilters } from './ProductFilters';
import { ProductAdd } from './ProductAdd';
import { ProductList } from './ProductList';
import { Product } from '@/entities/product';
import { useGetProducts } from '@/hooks/product';

export const Products = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetProducts();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data) setProducts(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredProducts = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return products.filter((product) => (filterName ? normalize(product.name).includes(normalize(filterName)) : true));
  }, [products, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Productos
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ProductFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <ProductAdd setProducts={setProducts} />
      </Flex>
      <ProductList products={filteredProducts} isLoading={isLoading} error={error} setProducts={setProducts} />
    </>
  );
};
