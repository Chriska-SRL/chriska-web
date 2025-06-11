// Este archivo incluye la versión adaptada para productos
// Componente principal (Products.tsx)

'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import { ProductFilters } from './ProductFilters';
import { ProductAdd } from './ProductAdd';
import { ProductList } from './ProductList';

export const Products = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [filterName, setFilterName] = useState<string>('');

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Productos
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ProductFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <ProductAdd />
      </Flex>
      <ProductList filterName={filterName} />
    </>
  );
};
