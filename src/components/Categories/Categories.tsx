'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useState } from 'react';
import { CategoryList } from './CategoryList';
import { CategoryAdd } from './CategoryAdd';
import { CategoryFilters } from './CategoryFilters';

export const Categories = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [filterName, setFilterName] = useState<string>('');

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Categorias
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="flex-end" gap="1rem" w="100%">
        <CategoryFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <CategoryAdd />
      </Flex>
      <CategoryList filterName={filterName} />
    </>
  );
};
