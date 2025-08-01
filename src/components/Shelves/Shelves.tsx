'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { ShelveList } from './ShelveList';
import { ShelveAdd } from './ShelveAdd';
import { ShelveFilters } from './ShelveFilters';
import { Shelve } from '@/entities/shelve';
import { useGetShelves } from '@/hooks/shelve';
import { useGetWarehousesSimple } from '@/hooks/warehouse';

export const Shelves = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [shelves, setShelves] = useState<Shelve[]>([]);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter state
  const [filterName, setFilterName] = useState<string>('');
  const [filterWarehouseId, setFilterWarehouseId] = useState<number | undefined>(undefined);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  
  // Get warehouses for adding shelves and for the parent warehouse reference
  const { data: warehouses } = useGetWarehousesSimple();
  
  // Filters for API call
  const filters = useMemo(() => ({
    name: filterName || undefined,
    warehouseId: filterWarehouseId,
  }), [filterName, filterWarehouseId]);

  const { data, isLoading, error } = useGetShelves(currentPage, pageSize, filters);

  useEffect(() => {
    if (data) {
      setShelves(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterName !== '' || filterWarehouseId) {
      setIsFilterLoading(true);
    }
  }, [filterName, filterWarehouseId]);

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
          Estanterías
        </Text>
        {isMobile && warehouses && (
          <ShelveAdd 
            warehouse={warehouses[0]} 
            setWarehouses={() => {}} 
          />
        )}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ShelveFilters 
          isLoading={isLoading} 
          filterName={filterName} 
          setFilterName={setFilterName}
          filterWarehouseId={filterWarehouseId}
          setFilterWarehouseId={setFilterWarehouseId}
        />
        {!isMobile && warehouses && (
          <>
            <Divider orientation="vertical" />
            <ShelveAdd 
              warehouse={warehouses[0]} 
              setWarehouses={() => {}} 
            />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <ShelveList
        shelves={shelves}
        setShelves={setShelves}
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