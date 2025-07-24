'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { BrandFilters } from './BrandFilters';
import { BrandAdd } from './BrandAdd';
import { BrandList } from './BrandList';
import { Brand } from '@/entities/brand';
import { useGetBrands } from '@/hooks/brand';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export const Brands = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const { data, isLoading, error } = useGetBrands();
  const [brands, setBrands] = useState<Brand[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [brandToOpenModal, setBrandToOpenModal] = useState<number | null>(null);

  const brandToOpen = searchParams.get('open');

  useEffect(() => {
    if (brandToOpen && brands.length > 0) {
      const brand = brands.find((z) => z.id.toString() === brandToOpen);
      if (brand) {
        setBrandToOpenModal(brand.id);
        router.replace('/marcas', { scroll: false });
      }
    }
  }, [brandToOpen, brands, router]);

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
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Marcas
        </Text>
        {isMobile && <BrandAdd setBrands={setBrands} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <BrandFilters filterName={filterName} setFilterName={setFilterName} />
        {!isMobile && <BrandAdd setBrands={setBrands} />}
      </Flex>

      {isMobile && <Divider />}

      <BrandList
        brands={filteredBrands}
        isLoading={isLoading}
        error={error}
        setBrands={setBrands}
        brandToOpenModal={brandToOpenModal}
        setBrandToOpenModal={setBrandToOpenModal}
      />
    </>
  );
};
