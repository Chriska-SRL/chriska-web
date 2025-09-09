'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { SupplierReceiptList } from './SupplierReceiptList';
import { SupplierReceiptAdd } from './SupplierReceiptAdd';
import { SupplierReceiptFilters } from './SupplierReceiptFilters';
import { SupplierReceipt } from '@/entities/supplierReceipt';
import { useGetSupplierReceipts } from '@/hooks/supplierReceipt';

export const SupplierReceipts = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [receipts, setReceipts] = useState<SupplierReceipt[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [filters, setFilters] = useState<{
    supplierId?: number;
    paymentMethod?: string;
    fromDate?: string;
    toDate?: string;
  }>({});

  const { data, isLoading, error } = useGetSupplierReceipts(page, pageSize, filters);

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
    (newFilters: { supplierId?: number; paymentMethod?: string; fromDate?: string; toDate?: string }) => {
      setFilters(newFilters);
    },
    [],
  );

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          Pagos a proveedores
        </Text>
        {isMobile && <SupplierReceiptAdd isLoading={isLoading} setReceipts={setReceipts} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <SupplierReceiptFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />
        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <SupplierReceiptAdd isLoading={isLoading} setReceipts={setReceipts} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <SupplierReceiptList
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
