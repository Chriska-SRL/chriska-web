'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { OrderFilters } from './OrderFilters';
import { OrderList } from './OrderList';
import { useGetOrders } from '@/hooks/order';
import { Order } from '@/entities/order';

export const Orders = () => {
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

  const { data, isLoading, error } = useGetOrders(currentPage, pageSize, filters);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (data) {
      setOrders(data);
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
          Órdenes
        </Text>
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="flex-start" gap="1rem" w="100%">
        <OrderFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />
      </Flex>

      {isMobile && <Divider />}

      <OrderList
        orders={orders}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setOrders={setOrders}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
};
