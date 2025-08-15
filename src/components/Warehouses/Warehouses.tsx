'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { WarehouseList } from './WarehouseList';
import { WarehouseAdd } from './WarehouseAdd';
import { WarehouseFilters } from './WarehouseFilters';
import { Warehouse } from '@/entities/warehouse';
import { useGetWarehouses } from '@/hooks/warehouse';

export const Warehouses = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state
  const [filterName, setFilterName] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Filters for API call
  const filters = useMemo(
    () => ({
      name: filterName || undefined,
    }),
    [filterName],
  );

  const { data, isLoading, error } = useGetWarehouses(currentPage, pageSize, filters);

  useEffect(() => {
    if (data) {
      setWarehouses(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '') {
      setIsFilterLoading(true);
    }
  }, [filterName]);

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
          Depósitos y estanterías
        </Text>
        {isMobile && <WarehouseAdd isLoading={isLoading} setWarehouses={setWarehouses} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <WarehouseFilters isLoading={isLoading} filterName={filterName} setFilterName={setFilterName} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <WarehouseAdd isLoading={isLoading} setWarehouses={setWarehouses} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <WarehouseList
        warehouses={warehouses}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setWarehouses={setWarehouses}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
