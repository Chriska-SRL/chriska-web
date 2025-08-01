'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BrandFilters } from './BrandFilters';
import { BrandAdd } from './BrandAdd';
import { BrandList } from './BrandList';
import { Brand } from '@/entities/brand';
import { useGetBrands } from '@/hooks/brand';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

export const Brands = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterName, setFilterName] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetBrands(currentPage, pageSize, filterName);
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
    if (data) {
      setBrands(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '') {
      setIsFilterLoading(true);
    }
  }, [filterName]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Marcas
        </Text>
        {isMobile && <BrandAdd isLoading={isLoading} setBrands={setBrands} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <BrandFilters isLoading={isLoading} filterName={filterName} setFilterName={setFilterName} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <BrandAdd isLoading={isLoading} setBrands={setBrands} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <BrandList
        brands={brands}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setBrands={setBrands}
        brandToOpenModal={brandToOpenModal}
        setBrandToOpenModal={setBrandToOpenModal}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
