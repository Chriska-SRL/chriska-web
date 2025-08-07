'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { StockMovementList } from './StockMovementList';
import { StockMovement } from '@/entities/stockMovement';
import { useGetStockMovements } from '@/hooks/stockMovement';
import { StockMovementAdd } from './StockMovementAdd';
import { StockMovementFilters } from './StockMovementFilters';

export const StockMovements = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const [filters, setFilters] = useState<{
    Type?: string;
    DateFrom?: string;
    DateTo?: string;
    ProductId?: number;
    CreatedBy?: number;
  }>({
    Type: undefined,
    DateFrom: undefined,
    DateTo: undefined,
    ProductId: undefined,
    CreatedBy: undefined,
  });

  const { data, isLoading, error } = useGetStockMovements(page, pageSize, filters);

  useEffect(() => {
    if (data) {
      setStockMovements(data);
      setHasNextPage(false);
    }
  }, [data]);

  const handleFilterChange = useCallback(
    (newFilters: { Type?: string; DateFrom?: string; DateTo?: string; ProductId?: number; CreatedBy?: number }) => {
      setIsFilterLoading(true);
      setFilters(newFilters);
      setPage(1);

      setTimeout(() => {
        setIsFilterLoading(false);
      }, 500);
    },
    [],
  );

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          {isMobile ? 'Mov.' : 'Movimientos'} de stock
        </Text>
        {isMobile && <StockMovementAdd setStockMovements={setStockMovements} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <StockMovementFilters filters={filters} onFiltersChange={handleFilterChange} isLoading={isFilterLoading} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <StockMovementAdd setStockMovements={setStockMovements} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <StockMovementList
        stockMovements={stockMovements}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setStockMovements={setStockMovements}
        currentPage={page}
        pageSize={pageSize}
        hasNextPage={hasNextPage}
        onPageChange={setPage}
      />
    </>
  );
};
