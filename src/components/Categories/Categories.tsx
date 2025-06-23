'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { CategoryList } from './CategoryList';
import { CategoryAdd } from './CategoryAdd';
import { CategoryFilters } from './CategoryFilters';
import { Category } from '@/entities/category';
import { useGetCategories } from '@/hooks/category';

export const Categories = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetCategories();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (data) setCategories(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredCategories = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return categories.filter((category) =>
      filterName ? normalize(category.name).includes(normalize(filterName)) : true,
    );
  }, [categories, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Categorías
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="flex-end" gap="1rem" w="100%">
        <CategoryFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <CategoryAdd setCategories={setCategories} />
      </Flex>
      <CategoryList categories={filteredCategories} isLoading={isLoading} error={error} setCategories={setCategories} />
    </>
  );
};
