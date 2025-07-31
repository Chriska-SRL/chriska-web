'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { SubCategoryList } from './SubCategoryList';
import { SubCategoryAdd } from './SubCategoryAdd';
import { SubCategoryFilters } from './SubCategoryFilters';
import { SubCategory } from '@/entities/subcategory';
import { useGetSubCategories } from '@/hooks/subcategory';
import { useGetCategoriesSimple } from '@/hooks/category';

export const SubCategories = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter state
  const [filterName, setFilterName] = useState<string>('');
  const [filterCategoryId, setFilterCategoryId] = useState<number | undefined>(undefined);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  // Get categories for adding subcategories and for the parent category reference
  const { data: categories } = useGetCategoriesSimple();
  
  // Filters for API call
  const filters = useMemo(() => ({
    name: filterName || undefined,
    categoryId: filterCategoryId,
  }), [filterName, filterCategoryId]);

  const { data, isLoading, error } = useGetSubCategories(currentPage, pageSize, filters);

  useEffect(() => {
    if (data) {
      setSubcategories(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '' || filterCategoryId) {
      setIsFilterLoading(true);
    }
  }, [filterName, filterCategoryId]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  }, []);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Subcategorías
        </Text>
        {isMobile && categories && (
          <SubCategoryAdd 
            category={categories[0]} 
            setCategories={() => {}} 
          />
        )}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <SubCategoryFilters 
          isLoading={isLoading} 
          filterName={filterName} 
          setFilterName={setFilterName}
          filterCategoryId={filterCategoryId}
          setFilterCategoryId={setFilterCategoryId}
        />
        {!isMobile && categories && (
          <SubCategoryAdd 
            category={categories[0]} 
            setCategories={() => {}} 
          />
        )}
      </Flex>

      {isMobile && <Divider />}

      <SubCategoryList
        subcategories={subcategories}
        setSubcategories={setSubcategories}
        isLoading={isLoading || isFilterLoading}
        error={error}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};