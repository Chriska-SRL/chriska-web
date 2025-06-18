// Products.tsx
'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ProductFilters } from './ProductFilters';
import { ProductAdd } from './ProductAdd';
import { ProductList } from './ProductList';
import { Product } from '@/entities/product';
import { useGetProducts } from '@/hooks/product';

export const Products = () => {
  const [filterName, setFilterName] = useState<string>('');
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const { data: products = [], isLoading, error } = useGetProducts();
  const [localProducts, setLocalProducts] = useState<Product[]>(products);

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Productos
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ProductFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <ProductAdd setLocalProducts={setLocalProducts} />
      </Flex>
      <ProductList
        filterName={filterName}
        products={localProducts}
        isLoading={isLoading}
        error={error}
        setLocalProducts={setLocalProducts}
      />
    </>
  );
};
