'use client';

import { Divider, Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { ReturnRequestFilters } from './ReturnRequestFilters';
import { ReturnRequestAdd } from './ReturnRequestAdd';
import { ReturnRequestList } from './ReturnRequestList';
import { ReturnRequestEdit } from './ReturnRequestEdit';
import { useGetReturnRequests } from '@/hooks/returnRequest';
import { ReturnRequest } from '@/entities/returnRequest';
import { useSearchParams } from 'next/navigation';

export const ReturnRequests = () => {
  const searchParams = useSearchParams();
  const deliveryIdParam = searchParams.get('deliveryId');
  const shouldAddParam = searchParams.get('add');

  const [isMobile] = useMediaQuery('(max-width: 48rem)');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filterStatus, setFilterStatus] = useState<string | undefined>();
  const [filterClientId, setFilterClientId] = useState<number | undefined>();
  const [filterUserId, setFilterUserId] = useState<number | undefined>();
  const [filterFromDate, setFilterFromDate] = useState<string>('');
  const [filterToDate, setFilterToDate] = useState<string>('');
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [editingReturnRequest, setEditingReturnRequest] = useState<ReturnRequest | null>(null);

  const filters = useMemo(() => {
    const result: { status?: string; clientId?: number; userId?: number; fromDate?: string; toDate?: string } = {};
    if (filterStatus) result.status = filterStatus;
    if (filterClientId) result.clientId = filterClientId;
    if (filterUserId) result.userId = filterUserId;
    if (filterFromDate) result.fromDate = filterFromDate;
    if (filterToDate) result.toDate = filterToDate;
    return Object.keys(result).length > 0 ? result : undefined;
  }, [filterStatus, filterClientId, filterUserId, filterFromDate, filterToDate]);

  const { data, isLoading, error } = useGetReturnRequests(currentPage, pageSize, filters);
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);

  useEffect(() => {
    if (data) {
      setReturnRequests(data);
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
          Devoluciones
        </Text>
        {isMobile && (
          <ReturnRequestAdd
            isLoading={isLoading}
            setReturnRequests={setReturnRequests}
            preselectedDeliveryId={deliveryIdParam ? Number(deliveryIdParam) : undefined}
            forceOpen={shouldAddParam === 'true'}
            onReturnRequestCreated={setEditingReturnRequest}
          />
        )}
      </Flex>

      {isMobile && <Divider />}

      <Flex direction={{ base: 'column', md: 'row' }} justifyContent="space-between" gap="1rem" w="100%">
        <ReturnRequestFilters onFilterChange={handleFilterChange} disabled={isLoading || isFilterLoading} />

        {!isMobile && (
          <>
            <Divider orientation="vertical" />
            <ReturnRequestAdd
              isLoading={isLoading}
              setReturnRequests={setReturnRequests}
              preselectedDeliveryId={deliveryIdParam ? Number(deliveryIdParam) : undefined}
              forceOpen={shouldAddParam === 'true'}
              onReturnRequestCreated={setEditingReturnRequest}
            />
          </>
        )}
      </Flex>

      {isMobile && <Divider />}

      <ReturnRequestList
        returnRequests={returnRequests}
        isLoading={isLoading || isFilterLoading}
        error={error}
        setReturnRequests={setReturnRequests}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />

      {editingReturnRequest && (
        <ReturnRequestEdit
          isOpen={!!editingReturnRequest}
          onClose={() => setEditingReturnRequest(null)}
          returnRequest={editingReturnRequest}
          setReturnRequests={setReturnRequests}
        />
      )}
    </>
  );
};
