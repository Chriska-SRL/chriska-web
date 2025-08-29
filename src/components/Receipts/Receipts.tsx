'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { ReceiptList } from './ReceiptList';
import { ReceiptAdd } from './ReceiptAdd';
import { ReceiptFilters } from './ReceiptFilters';
import { Receipt } from '@/entities/receipt';
import { useGetReceipts } from '@/hooks/receipt';

export const Receipts = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [filters, setFilters] = useState<{
    clientId?: number;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const { data, isLoading, error } = useGetReceipts(page, pageSize, filters);

  useEffect(() => {
    if (data) {
      setReceipts(data);
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
    (newFilters: { clientId?: number; paymentMethod?: string; fromDate?: string; toDate?: string }) => {
      setFilters(newFilters);
    },
    [],
  );

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Pagos
        </Text>
        {isMobile && <ReceiptAdd isLoading={isLoading} setReceipts={setReceipts} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ReceiptFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />
        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <ReceiptAdd isLoading={isLoading} setReceipts={setReceipts} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <ReceiptList
        receipts={isFilterLoading ? [] : receipts}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setReceipts={setReceipts}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </>
  );
};
