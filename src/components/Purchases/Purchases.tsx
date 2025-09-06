'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { PurchaseList } from './PurchaseList';
import { PurchaseAdd } from './PurchaseAdd';
import { PurchaseFilters } from './PurchaseFilters';
import { Purchase } from '@/entities/purchase';
import { useGetPurchases } from '@/hooks/purchase';

export const Purchases = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [filters, setFilters] = useState<{
    supplierId?: number;
    invoiceNumber?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const { data, isLoading, error } = useGetPurchases(page, pageSize, filters);

  useEffect(() => {
    if (data) {
      setPurchases(data);
      setIsFilterLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
    if (Object.keys(filters).length > 0) {
      setIsFilterLoading(true);
    }
  }, [filters]);

  const handleFilterChange = useCallback(
    (newFilters: { supplierId?: number; invoiceNumber?: string; fromDate?: string; toDate?: string }) => {
      setFilters(newFilters);
    },
    [],
  );

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Facturas
        </Text>
        {isMobile && <PurchaseAdd isLoading={isLoading} setPurchases={setPurchases} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <PurchaseFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />
        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <PurchaseAdd isLoading={isLoading} setPurchases={setPurchases} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <PurchaseList
        purchases={isFilterLoading ? [] : purchases}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setPurchases={setPurchases}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
};
