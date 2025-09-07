'use client';

import { Flex, Text, IconButton, Box, useMediaQuery } from '@chakra-ui/react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { SupplierAccountStatementFilters } from './SupplierAccountStatementFilters';
import { SupplierAccountStatementList } from './SupplierAccountStatementList';
import { useGetSupplierAccountStatements } from '@/hooks/supplierAccountStatement';
import { MdArrowBackIosNew } from 'react-icons/md';
import { useRouter } from 'next/navigation';

type SupplierAccountStatementsProps = {
  supplierId: number;
  supplierName?: string;
};

export const SupplierAccountStatements = ({ supplierId, supplierName }: SupplierAccountStatementsProps) => {
  const router = useRouter();
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<{
    fromDate?: string;
    toDate?: string;
  }>({});
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const { data, isLoading, error } = useGetSupplierAccountStatements(supplierId, filters);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setIsFilterLoading(true);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  }, []);

  useEffect(() => {
    if (data !== undefined) {
      setIsFilterLoading(false);
    }
  }, [data]);

  // Paginate items locally
  const paginatedItems = useMemo(() => {
    if (!data?.items) return [];
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.items.slice(startIndex, endIndex);
  }, [data?.items, currentPage, pageSize]);

  const hasNextPage = data?.items ? data.items.length > currentPage * pageSize : false;

  return (
    <Flex direction="column" h="100%" gap="1rem">
      <Box>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center" gap="0.5rem">
            <IconButton
              aria-label="Volver"
              icon={<MdArrowBackIosNew />}
              onClick={() => router.push('/proveedores')}
              variant="ghost"
              size="sm"
            />
            <Flex gap={{ base: '0', md: '0.5rem' }} alignItems={{ base: 'start', md: 'baseline' }}>
              {!isMobile && (
                <Text fontSize="1.5rem" fontWeight="bold">
                  Estado de cuenta:&nbsp;
                </Text>
              )}
              <Text fontSize="1.5rem" fontWeight="bold">
                {supplierName || `Proveedor #${supplierId}`}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      <Box flexShrink="0">
        <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
          <SupplierAccountStatementFilters
            onFilterChange={handleFilterChange}
            disabled={isLoading || isFilterLoading}
            totalBalance={data?.totalBalance}
          />
        </Flex>
      </Box>

      <SupplierAccountStatementList
        items={isFilterLoading ? [] : paginatedItems}
        isLoading={isLoading || isFilterLoading}
        error={error}
        currentPage={currentPage}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </Flex>
  );
};
