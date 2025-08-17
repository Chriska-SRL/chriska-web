'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { OrderRequestFilters } from './OrderRequestFilters';
import { OrderRequestAdd } from './OrderRequestAdd';
import { OrderRequestList } from './OrderRequestList';
import { useGetOrderRequests } from '@/hooks/orderRequest';
import { OrderRequest } from '@/entities/orderRequest';

export const OrderRequests = () => {
  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterClientId, setFilterClientId] = useState<number | undefined>();
  const [filterUserId, setFilterUserId] = useState<number | undefined>();
  const [filterFromDate, setFilterFromDate] = useState<string>('');
  const [filterToDate, setFilterToDate] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const filters = useMemo(() => {
    const result: { status?: string; clientId?: number; userId?: number; fromDate?: string; toDate?: string } = {};
    if (filterStatus) result.status = filterStatus;
    if (filterClientId) result.clientId = filterClientId;
    if (filterUserId) result.userId = filterUserId;
    if (filterFromDate) result.fromDate = filterFromDate;
    if (filterToDate) result.toDate = filterToDate;
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filterStatus, filterClientId, filterUserId, filterFromDate, filterToDate]);

  const { data, isLoading, error } = useGetOrderRequests(currentPage, pageSize, filters);
  const [orderRequests, setOrderRequests] = useState<OrderRequest[]>([]);

  useEffect(() => {
    if (data) {
      setOrderRequests(data);
      setIsFilterLoading(false);
    }
  }, [data]);

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
          Pedidos
        </Text>
        {isMobile && <OrderRequestAdd isLoading={isLoading} setOrderRequests={setOrderRequests} />}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <OrderRequestFilters onFilterChange={handleFilterChange} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <OrderRequestAdd isLoading={isLoading} setOrderRequests={setOrderRequests} />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <OrderRequestList
        orderRequests={orderRequests}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setOrderRequests={setOrderRequests}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
