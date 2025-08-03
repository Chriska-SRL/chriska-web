'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ProductFilters } from './ProductFilters';
import { ProductAdd } from './ProductAdd';
import { ProductList } from './ProductList';
import { Product } from '@/entities/product';
import { useGetProducts } from '@/hooks/product';

type SearchParam = 'name' | 'internalCode' | 'barcode';

export const Products = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterName, setFilterName] = useState<string>('');
  const [filterUnitType, setFilterUnitType] = useState<string | undefined>();
  const [filterBrand, setFilterBrand] = useState<string | undefined>();
  const [filterCategory, setFilterCategory] = useState<string | undefined>();
  const [filterSubCategory, setFilterSubCategory] = useState<string | undefined>();
  const [searchParam, setSearchParam] = useState<SearchParam>('name');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const filters = useMemo(() => {
    const result: {
      name?: string;
      internalCode?: string;
      barcode?: string;
      unitType?: string;
      brandId?: number;
      categoryId?: number;
      subCategoryId?: number;
    } = {};
    
    if (filterName) {
      switch (searchParam) {
        case 'name':
          result.name = filterName;
          break;
        case 'internalCode':
          result.internalCode = filterName;
          break;
        case 'barcode':
          result.barcode = filterName;
          break;
      }
    }
    
    if (filterUnitType) result.unitType = filterUnitType;
    if (filterBrand) result.brandId = parseInt(filterBrand);
    if (filterCategory) result.categoryId = parseInt(filterCategory);
    if (filterSubCategory) result.subCategoryId = parseInt(filterSubCategory);
    
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filterName, searchParam, filterUnitType, filterBrand, filterCategory, filterSubCategory]);

  const { data, isLoading, error } = useGetProducts(currentPage, pageSize, filters);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data) {
      setProducts(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '' || filterUnitType || filterBrand || filterCategory || filterSubCategory) {
      setIsFilterLoading(true);
    }
  }, [filterName, searchParam, filterUnitType, filterBrand, filterCategory, filterSubCategory]);

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
          Productos
        </Text>
        {isMobile && <ProductAdd isLoading={isLoading} setProducts={setProducts} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ProductFilters
          isLoading={isLoading}
          filterName={filterName}
          setFilterName={setFilterName}
          filterUnitType={filterUnitType}
          setFilterUnitType={setFilterUnitType}
          filterBrand={filterBrand}
          setFilterBrand={setFilterBrand}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          filterSubCategory={filterSubCategory}
          setFilterSubCategory={setFilterSubCategory}
          searchParam={searchParam}
          setSearchParam={setSearchParam}
        />
        {!isMobile && <ProductAdd isLoading={isLoading} setProducts={setProducts} />}
      </Flex>

      {isMobile && <Divider />}

      <ProductList
        products={products}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setProducts={setProducts}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
