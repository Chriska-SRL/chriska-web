'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { SupplierFilters } from './SupplierFilters';
import { SupplierAdd } from './SupplierAdd';
import { SupplierList } from './SupplierList';
import { Supplier } from '@/entities/supplier';
import { useGetSuppliers } from '@/hooks/supplier';

export const Suppliers = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filterName, setFilterName] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetSuppliers(currentPage, pageSize, filterName);

  useEffect(() => {
    if (data) {
      setSuppliers(data);
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
          Proveedores
        </Text>
        {isMobile && <SupplierAdd isLoading={isLoading} setSuppliers={setSuppliers} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <SupplierFilters isLoading={isLoading} filterName={filterName} setFilterName={setFilterName} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <SupplierAdd isLoading={isLoading} setSuppliers={setSuppliers} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <SupplierList
        suppliers={suppliers}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setSuppliers={setSuppliers}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
