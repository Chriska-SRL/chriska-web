'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { DeliveryFilters } from './DeliveryFilters';
import { DeliveryList } from './DeliveryList';
import { useGetDeliveries } from '@/hooks/delivery';
import { Delivery } from '@/entities/delivery';
import { useSearchParams } from 'next/navigation';
import { getDistributionById } from '@/services/distribution';

export const Deliveries = () => {
  const searchParams = useSearchParams();
  const distributionId = searchParams.get('distribution');
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterClientId, setFilterClientId] = useState<number | undefined>();
  const [filterUserId, setFilterUserId] = useState<number | undefined>();
  const [filterFromDate, setFilterFromDate] = useState<string>('');
  const [filterToDate, setFilterToDate] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [isDistributionLoading, setIsDistributionLoading] = useState(false);

  const filters = useMemo(() => {
    const result: { status?: string; clientId?: number; userId?: number; fromDate?: string; toDate?: string } = {};
    if (filterStatus) result.status = filterStatus;
    if (filterClientId) result.clientId = filterClientId;
    if (filterUserId) result.userId = filterUserId;
    if (filterFromDate) result.fromDate = filterFromDate;
    if (filterToDate) result.toDate = filterToDate;
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filterStatus, filterClientId, filterUserId, filterFromDate, filterToDate]);

  const { data, isLoading, error } = useGetDeliveries(
    distributionId ? undefined : currentPage,
    distributionId ? undefined : pageSize,
    distributionId ? undefined : filters,
  );
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    if (distributionId) {
      setIsDistributionLoading(true);
      getDistributionById(Number(distributionId))
        .then((distribution) => {
          setDeliveries(distribution.deliveries || []);
        })
        .catch((err) => {
          console.error('Error loading distribution deliveries:', err);
          setDeliveries([]);
        })
        .finally(() => {
          setIsDistributionLoading(false);
        });
    } else if (data) {
      setDeliveries(data);
      setIsFilterLoading(false);
    }
  }, [data, distributionId]);

  useEffect(() => {
    setCurrentPage(1);
    if (filterStatus || filterClientId || filterUserId || filterFromDate || filterToDate) {
      setIsFilterLoading(true);
    }
  }, [filterStatus, filterClientId, filterUserId, filterFromDate, filterToDate]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: {
    status?: string;
    clientId?: number;
    userId?: number;
    fromDate?: string;
    toDate?: string;
  }) => {
    setFilterStatus(newFilters.status);
    setFilterClientId(newFilters.clientId);
    setFilterUserId(newFilters.userId);
    setFilterFromDate(newFilters.fromDate || '');
    setFilterToDate(newFilters.toDate || '');
  };

  return (
    <>
      <Flex gap="2rem" justifyContent="space-between" alignItems="center">
        <Text fontSize="1.5rem" fontWeight="bold">
          {distributionId ? `Entregas del Reparto #${distributionId}` : 'Entregas'}
        </Text>
      </Flex>

      {isMobile && <Divider />}

      {!distributionId && (
        <Flex direction={{ base: 'column', md: 'row' }} justifyContent="flex-start" gap="1rem" w="100%">
          <DeliveryFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />
        </Flex>
      )}

      {isMobile && <Divider />}

      <DeliveryList
        deliveries={deliveries}
        isLoading={isLoading || isFilterLoading || isDistributionLoading}
        error={error}
        setDeliveries={setDeliveries}
        currentPage={distributionId ? 1 : currentPage}
        pageSize={distributionId ? deliveries.length || 10 : pageSize}
        onPageChange={distributionId ? () => {} : handlePageChange}
        onPageSizeChange={distributionId ? () => {} : handlePageSizeChange}
        showPagination={!distributionId}
      />
    </>
  );
};
