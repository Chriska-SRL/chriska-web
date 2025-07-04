'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { BrandFilters } from './BrandFilters';
import { BrandAdd } from './BrandAdd';
import { BrandList } from './BrandList';
import { Brand } from '@/entities/brand';
import { useGetBrands } from '@/hooks/brand';

export const Brands = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetBrands();
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    if (data) setBrands(data);
  }, [data]);

  const [filterName, setFilterName] = useState<string>('');

  const filteredBrands = useMemo(() => {
    const normalize = (text: string) =>
      text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

    return brands.filter((brand) => {
      const matchName = filterName ? normalize(brand.name).includes(normalize(filterName)) : true;
      return matchName;
    });
  }, [brands, filterName]);

  return (
    <>
      <Text fontSize="1.5rem" fontWeight="bold">
        Zonas
      </Text>
      <Flex direction={{ base: 'column-reverse', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <BrandFilters filterName={filterName} setFilterName={setFilterName} />
        {isMobile && <Divider />}
        <BrandAdd setBrands={setBrands} />
      </Flex>
      <BrandList brands={filteredBrands} isLoading={isLoading} error={error} setBrands={setBrands} />
    </>
  );
};
