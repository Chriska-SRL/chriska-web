'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StockMovementList } from './StockMovementList';
import { StockMovement } from '@/entities/stockMovement';
import { useGetStockMovements } from '@/hooks/stockMovement';
import { StockMovementAdd } from './StockMovementAdd';
import { StockMovementFilters } from './StockMovementFilters';

export const StockMovements = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedProductId = searchParams.get('product') ? Number(searchParams.get('product')) : undefined;

  // Función para limpiar el parámetro de URL
  const clearProductParam = useCallback(() => {
    if (preselectedProductId) {
      router.replace('/movimientos-de-stock');
    }
  }, [preselectedProductId, router]);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
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

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          {isMobile ? 'Mov.' : 'Movimientos'} de stock
        </Text>
        {isMobile && (
          <StockMovementAdd
            setStockMovements={setStockMovements}
            preselectedProductId={preselectedProductId}
            onModalClose={clearProductParam}
          />
        )}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <StockMovementFilters filters={filters} onFiltersChange={handleFilterChange} isLoading={isFilterLoading} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <StockMovementAdd
              setStockMovements={setStockMovements}
              preselectedProductId={preselectedProductId}
              onModalClose={clearProductParam}
            />
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
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
