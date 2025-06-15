'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CategoryList } from './CategoryList';
import { CategoryAdd } from './CategoryAdd';
import { CategoryFilters } from './CategoryFilters';
import { Category } from '@/entities/category';
import { useGetCategories } from '@/hooks/category';

export const Categories = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [filterName, setFilterName] = useState<string>('');
  const { data: categories = [], isLoading, error } = useGetCategories();
  const [localCategories, setLocalCategories] = useState<Category[]>(categories);

  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Categorias
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="flex-end" gap="1rem" w="100%">
        <CategoryFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <CategoryAdd setLocalCategories={setLocalCategories} />
      </Flex>
      <CategoryList
        filterName={filterName}
        categories={localCategories}
        isLoading={isLoading}
        error={error}
        setLocalCategories={setLocalCategories}
      />
    </>
  );
};
